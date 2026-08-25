export const validateProfileUpdate = (req, res, next) => {
    const { name, bio } = req.body;

    if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 2 characters"
            });
        }
    }

    if (bio !== undefined && typeof bio !== "string") {
        return res.status(400).json({
            success: false,
            message: "Bio must be a string"
        });
    }

    next();
};

export const validateSkillsUpdate = (req, res, next) => {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
        return res.status(400).json({
            success: false,
            message: "Skills must be an array"
        });
    }

    if (skills.some((skill) => typeof skill !== "string")) {
        return res.status(400).json({
            success: false,
            message: "Each skill must be a string"
        });
    }

    next();
};

export const validateAvailabilityUpdate = (req, res, next) => {
    const { status, hoursPerDay } = req.body;

    if (
        status !== undefined &&
        !["available", "unavailable"].includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid availability status"
        });
    }

    if (
        hoursPerDay !== undefined &&
        (typeof hoursPerDay !== "number" ||
            hoursPerDay < 0 ||
            hoursPerDay > 24)
    ) {
        return res.status(400).json({
            success: false,
            message: "Hours per day must be between 0 and 24"
        });
    }

    next();
};