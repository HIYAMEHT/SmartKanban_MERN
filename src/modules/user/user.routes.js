const express = require("express");

const {
  getProfile,
  updateProfile,
  getSkills,
  updateSkills,
  getAvailability,
  updateAvailability,
  getUserIntelligence,
} = require("./user.controller");

const {
  validateProfileUpdate,
  validateSkillsUpdate,
  validateAvailabilityUpdate,
} = require("./user.validator");

const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user's profile
 *     description: Returns the profile of the currently authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.get("/profile", authMiddleware, getProfile);


/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user's profile
 *     description: Updates profile information of the currently authenticated user.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tanvi Nirwan
 *               bio:
 *                 type: string
 *                 example: Full Stack Developer
 *             example:
 *               name: Tanvi Nirwan
 *               bio: Full Stack Developer
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.patch(
  "/profile",
  authMiddleware,
  validateProfileUpdate,
  updateProfile
);


/**
 * @swagger
 * /api/users/skills:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user's skills
 *     description: Returns the skills of the currently authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Skills fetched successfully
 *       401:
 *         description: Authentication required
 */
router.get("/skills", authMiddleware, getSkills);


/**
 * @swagger
 * /api/users/skills:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update current user's skills
 *     description: Replaces the skills of the currently authenticated user.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - JavaScript
 *                   - Node.js
 *                   - MongoDB
 *                   - React
 *             example:
 *               skills:
 *                 - JavaScript
 *                 - Node.js
 *                 - MongoDB
 *                 - React
 *     responses:
 *       200:
 *         description: Skills updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.put(
  "/skills",
  authMiddleware,
  validateSkillsUpdate,
  updateSkills
);


/**
 * @swagger
 * /api/users/availability:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user's availability
 *     description: Returns the availability information of the currently authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Availability fetched successfully
 *       401:
 *         description: Authentication required
 */
router.get("/availability", authMiddleware, getAvailability);


/**
 * @swagger
 * /api/users/availability:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update current user's availability
 *     description: Updates the availability information of the currently authenticated user.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - available
 *                   - unavailable
 *                 example: available
 *               hoursPerDay:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 24
 *                 example: 8
 *             example:
 *               status: available
 *               hoursPerDay: 8
 *     responses:
 *       200:
 *         description: Availability updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.put(
  "/availability",
  authMiddleware,
  validateAvailabilityUpdate,
  updateAvailability
);


/**
 * @swagger
 * /api/users/{userId}/intelligence:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user intelligence
 *     description: Returns intelligence and analytics information for a specific user.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: MongoDB ID of the user
 *         schema:
 *           type: string
 *         example: 68b5a1234567890123456789
 *     responses:
 *       200:
 *         description: User intelligence fetched successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.get(
  "/:userId/intelligence",
  authMiddleware,
  getUserIntelligence
);

module.exports = router;