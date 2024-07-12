import React, { useState, useEffect } from "react";
import axios from "axios";
import './index.css'


function App() {
	const [file, setFile] = useState(null);
	const [images, setImages] = useState([]);
	const [uploadedImage, setUploadedImage] = useState(null);

	useEffect(() => {
		fetchImages();
	}, []);

	const fetchImages = async () => {
		try {
			const response = await axios.get("http://localhost:3001/files");
			console.log(response.data); // Log the URLs
			setImages(response.data);
		} catch (error) {
			console.error("Error fetching images:", error);
		}
	};

	const upload = async () => {
		const formData = new FormData();
		formData.append("file", file);

		try {
			await axios.post("http://localhost:3001/upload", formData);
			setUploadedImage(URL.createObjectURL(file)); // Create URL for the uploaded file
			setFile(null); // Clear the file input
			fetchImages(); // Fetch images after upload
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h1>Upload an Image</h1>
			<input type="file" onChange={(e) => setFile(e.target.files[0])} />
			<button type="button" onClick={upload}>
				Upload
			</button>

			{uploadedImage && (
				<div>
					<h2>Uploaded Image Preview</h2>
					<img
						src={uploadedImage}
						alt="Uploaded"
						style={{ width: "200px", margin: "10px" }}
					/>
				</div>
			)}

			<h2>Uploaded Images</h2>
			<div className="image-container">
				{images.map((image, index) => (
					<img
						key={index}
						src={image}
						alt={`Uploaded ${index}`}
						style={{ width: "200px", margin: "10px" }}
						onError={() => console.log(`Error loading image: ${image}`)} // Log errors if any
					/>
				))}
			</div>
		</div>
	);
}

export default App;
