import { Router } from "express";
import Problem from "../models/Problem.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import { analyzeProblem } from "../services/problemAnalyzer.js";
import { findDuplicateProblem } from "../services/duplicateDetector.js";

const router = Router();

// Create a new problem
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { title, description, category, location, photos, priority } =
      req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required.",
      });
    }

    const problem = await Problem.create({
      title,
      description,
      category,
      location,
      photos,
      priority,
      submittedBy: req.user._id,
    });

    const aiAnalysis = analyzeProblem({
      title,
      description,
      category,
      priority,
    });

    problem.aiAnalysis = {
      category: aiAnalysis.category,
      priority: aiAnalysis.priority,
      confidence: aiAnalysis.confidence,
    };

    await problem.save();

    const duplicateResult = await findDuplicateProblem({
      title,
      description,
      problemId: problem._id,
    });

    problem.aiAnalysis.isDuplicate = duplicateResult.isDuplicate;
    problem.aiAnalysis.duplicateOf = duplicateResult.duplicateOf;

    await problem.save();

    res.status(201).json({
      message: "Problem submitted successfully.",
      problem,
    });
  } catch (error) {
    next(error);
  }
});

// Get problems submitted by logged-in user
router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const problems = await Problem.find({
      submittedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ problems });
  } catch (error) {
    next(error);
  }
});

router.get("/all", requireAuth, allowRoles("admin"), async (req, res, next) => {
  try {
    const problems = await Problem.find()
      .populate("submittedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ problems });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/admin/stats",
  requireAuth,
  allowRoles("admin"),
  async (req, res, next) => {
    try {
      const totalProblems = await Problem.countDocuments();

      const pendingProblems = await Problem.countDocuments({
        status: { $in: ["submitted", "under_review"] },
      });

      const projectsInProgress = await Problem.countDocuments({
        status: "in_progress",
      });

      res.json({
        totalProblems,
        pendingProblems,
        projectsInProgress,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:id/status",
  requireAuth,
  allowRoles("admin"),
  async (req, res, next) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "submitted",
        "under_review",
        "assigned",
        "in_progress",
        "resolved",
        "rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status.",
        });
      }

      const problem = await Problem.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true },
      );

      if (!problem) {
        return res.status(404).json({
          message: "Problem not found.",
        });
      }

      res.json({
        message: "Problem status updated successfully.",
        problem,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/admin/reanalyze',
  requireAuth,
  allowRoles('admin'),
  async (req, res, next) => {
    try {
      const problems = await Problem.find().sort({ createdAt: 1 })

      let duplicateCount = 0

      for (const problem of problems) {
        const aiAnalysis = analyzeProblem({
          title: problem.title,
          description: problem.description,
          category: problem.category,
          priority: problem.priority,
        })

        const duplicateResult = await findDuplicateProblem({
          title: problem.title,
          description: problem.description,
          problemId: problem._id,
          createdAt: problem.createdAt,
        })

        problem.aiAnalysis = {
          category: aiAnalysis.category,
          priority: aiAnalysis.priority,
          confidence: aiAnalysis.confidence,
          isDuplicate: duplicateResult.isDuplicate,
          duplicateOf: duplicateResult.duplicateOf,
        }

        if (duplicateResult.isDuplicate) {
          duplicateCount++
        }

        await problem.save()
      }

      res.json({
        message: 'All problems re-analyzed successfully.',
        totalProblems: problems.length,
        duplicateCount,
      })
    } catch (error) {
      next(error)
    }
  }
)

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    let problem;

    if (req.user.role === "admin") {
      // Admin can view any problem
      problem = await Problem.findById(req.params.id);
    } else {
      // Citizen can only view their own problem
      problem = await Problem.findOne({
        _id: req.params.id,
        submittedBy: req.user._id,
      });
    }

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found.",
      });
    }

    res.json({ problem });
  } catch (error) {
    next(error);
  }
});

export default router;
