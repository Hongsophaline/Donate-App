export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();

  // These match your screenshot exactly
  formData.append("file", file);
  formData.append("upload_preset", "Mary_default");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dml6kygxk/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (!res.ok) {
      // Cloudinary returns helpful error messages in the JSON body
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary error:", error);
    throw error;
  }
};
