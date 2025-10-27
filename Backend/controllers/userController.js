import sql from "../configs/db.js";

// --- Fetch user's creations ---
export const getUserCreations = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const creations = await sql`
      SELECT * FROM creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    res.json({ success: true, creations });
  } catch (error) {
    console.error("getUserCreations error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user creations", error: error.message });
  }
};

// --- Fetch all published creations for community ---
export const getPublishedCreations = async (req, res) => {
  try {
    const creationsRaw = await sql`
      SELECT id, content, prompt, COALESCE(likes, '{}') AS likes
      FROM creations
      WHERE publish = true
      ORDER BY created_at DESC
    `;

    const creations = creationsRaw.map(c => ({
      ...c,
      likes: c.likes || [],
    }));

    res.json({ success: true, creations });
  } catch (error) {
    console.error("getPublishedCreations error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch published creations", error: error.message });
  }
};

// --- Toggle like/unlike on a creation ---
export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Creation ID is required" });
    }

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.status(404).json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();
    const isLiked = currentLikes.includes(userIdStr);

    const updatedLikes = isLiked
      ? currentLikes.filter(u => u !== userIdStr)
      : [...currentLikes, userIdStr];

    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

    res.json({ success: true, message: isLiked ? "Creation Unliked" : "Creation Liked" });
  } catch (error) {
    console.error("toggleLikeCreation error:", error);
    res.status(500).json({ success: false, message: "Failed to toggle like", error: error.message });
  }
};

// --- Create a new community creation (publishable) ---
export const createCommunityCreation = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { content, prompt, publish = true } = req.body;

    if (!content || !prompt) {
      return res.status(400).json({ success: false, message: "Content and prompt are required" });
    }

    const [newCreation] = await sql`
      INSERT INTO creations (user_id, content, prompt, publish, likes)
      VALUES (${userId}, ${content}, ${prompt}, ${publish}, '{}')
      RETURNING *
    `;

    res.json({ success: true, creation: newCreation });
  } catch (error) {
    console.error("createCommunityCreation error:", error);
    res.status(500).json({ success: false, message: "Failed to create community creation", error: error.message });
  }
};
