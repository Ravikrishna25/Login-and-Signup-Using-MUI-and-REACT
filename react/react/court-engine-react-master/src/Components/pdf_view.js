import { Grid } from "@mui/material";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { useLocation } from "react-router-dom";
import pdfFile from "./1.pdf";

function useQuery() {
	const { search } = useLocation();

	return useMemo(() => new URLSearchParams(search), [search]);
}
function PdfView({ ...props }) {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [text, setText] = useState("");
	const [data, setData] = useState(null);
	const query = useQuery();
	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}
	useEffect(() => {
		var id = query.get("id");
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				id: id,
			}),
		};
		fetch("http://127.0.0.1:8000/getPDf", requestOptions)
			.then((response) => {
				console.log(response);
				return response.json();
			})
			.then((data) => {
				console.log(data);
				setData(data);
				setText(data["_source"]["raw_text"]);
			});
	}, []);
	useEffect(() => {
		if (data != null) {
			console.log(data["_source"]["sections"]);
			const requestOptions1 = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({
					sections: data["_source"]["section"],
				}),
			};
			fetch("http://127.0.0.1:8000/section", requestOptions1)
				.then((response) => response.json())
				.then((data) => {
					console.log("Sectionsss");
					console.log(data);
				});
		}
	}, [data]);

	return (
		<Grid container columns={5}>
			<Grid item md={1}></Grid>
			<Grid item md={3}>
				<p>{text != "" && text}</p>
				<p>{text == "" && "Loading"}</p>
			</Grid>
			<Grid item md={2}></Grid>
		</Grid>
	);
}

export default PdfView;
