import {
	Button,
	Card,
	CardActions,
	CardContent,
	Grid,
	Menu,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./home.css";
import Navbar from "./Navbar";
import auth from "../firebase_config.js";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect } from "react";

// function search(dataMap) {
// 	console.log(dataMap);
// 	dataMap["queryText"] = "query";
// 	dataMap["text_sections"] = [];
// 	const requestOptions = {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 			"Access-Control-Allow-Origin": "*",
// 		},
// 		body: JSON.stringify(dataMap),
// 	};
// 	fetch("http://127.0.0.1:8000/search", requestOptions)
// 		.then((response) => response.json())
// 		.then((data) => {
// 			console.log(data);
// 		});
// }

function Home() {
	const [queryText, setQueryText] = useState("");
	const [suggestionList, setSuggestionList] = useState([]);
	useEffect(() => {
		if (queryText == "") {
			setSuggestionList([]);
		}
	}, [queryText]);

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();
	useEffect(() => {
		setQueryText(transcript);
	}, [transcript]);

	const [isMicOn, setMicStatus] = useState(false);
	const navigate = useNavigate();
	const [results, setResults] = useState([]);
	const [filterMap, setFilterMap] = useState({
		petitioner: [],
		respondent: [],
		section: [],
		court: "All",
		highCourtLocation: "",
		judgementNumber: "",
	});
	const search = (dataMap) => {
		console.log(dataMap);
		dataMap["queryText"] = queryText;
		dataMap["text_sections"] = [];
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify(dataMap),
		};
		fetch("http://127.0.0.1:8000/search", requestOptions)
			.then((response) => response.json())
			.then((data) => {
				var li = data["hits"]["hits"];
				var parsedList = [];
				for (var i = 0; i < li.length; i++) {
					var id = li[i]["_id"];
					var raw = li[i]["_source"]["raw_text"];
					var queryText = li[i]["_source"]["queryText"];
					parsedList.push({
						id: id,
						raw_text: raw,
						textString: queryText,
					});
				}

				setResults(parsedList);
			});
	};

	const handleOnSearch = (string, results) => {
		console.log(string, results);
	};

	const handleOnHover = (result) => {
		console.log(result);
	};

	const handleOnSelect = (item) => {
		console.log(item);
	};

	const handleOnFocus = () => {
		console.log("Focused");
	};

	const handleOnClear = () => {
		console.log("Cleared");
	};

	const formatResult = (item) => {
		console.log(item);
		return (
			<div className="result-wrapper">
				<span className="result-span">id: {item.id}</span>
				<span className="result-span">name: {item.name}</span>
			</div>
		);
	};
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className="App" style={{ height: "100%", width: "100%" }}>
			<Grid container columns={12}>
				<Grid item md={11}></Grid>
				<Grid item md={1}>
					<div>
						<Button
							id="basic-button"
							aria-controls={open ? "basic-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={open ? "true" : undefined}
							onClick={handleClick}>
							Account
						</Button>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}>
							<MenuItem onClick={handleClose}>Profile</MenuItem>
							<MenuItem onClick={handleClose}>
								My account
							</MenuItem>
							<MenuItem
								onClick={() => {
									signOut(auth);
									navigate("/", { replace: "true" });
								}}>
								Logout
							</MenuItem>
						</Menu>
					</div>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={2}
				columns={12}
				style={{ padding: "24px" }}>
				<Grid item md={3}>
					<Navbar
						setMap={setFilterMap}
						filterMap={filterMap}
						callSearchApi={() => {
							search(filterMap);
						}}
					/>
				</Grid>
				<Grid item md={1}></Grid>
				<Grid item md={5}>
					<div style={{ marginTop: "5vh" }}>
						<h1 style={{ textAlign: "center", fontSize: "3rem" }}>
							<Typography variant="h2" component="h3">
								J Search
							</Typography>
						</h1>

						<Grid container justifyContent={"center"}>
							<Grid item>
								<TextField
									inputProps={{
										style: {
											padding: 5,
										},
									}}
									style={{ width: "500px" }}
									value={queryText}
									onChange={(event) => {
										var str = event.target.value;
										if (str == "") {
											setSuggestionList([]);
										}
										if (str.slice(str.length - 1) == " ") {
											setSuggestionList([]);
											const requestOptions = {
												method: "POST",
												headers: {
													"Content-Type":
														"application/json",
													"Access-Control-Allow-Origin":
														"*",
												},
												body: JSON.stringify({
													queryString: queryText,
												}),
											};
											fetch(
												"http://127.0.0.1:8000/searchQuery",
												requestOptions
											)
												.then((response) =>
													response.json()
												)
												.then((data) => {
													console.log(data);

													var li = data;
													setSuggestionList(li);
												});
										}
										setQueryText(str);
									}}
								/>
								{suggestionList != [] && (
									<Paper>
										{suggestionList.map((val, index) => {
											return (
												<Typography
													onClick={() => {
														setQueryText(
															queryText +
																val.nextWords.join(
																	" "
																)
														);
														setSuggestionList([]);
													}}
													style={{
														paddingLeft: "10px",
														cursor: "pointer",
													}}
													key={index}
													variant="h6"
													component="h6">
													{queryText +
														val.nextWords.join(" ")}
												</Typography>
											);
										})}
									</Paper>
								)}
							</Grid>
							<Grid item>
								<Button
									onClick={() => {
										const requestOptions = {
											method: "POST",
											headers: {
												"Content-Type":
													"application/json",
												"Access-Control-Allow-Origin":
													"*",
											},
											body: JSON.stringify({
												queryString: queryText,
											}),
										};
										fetch(
											"http://127.0.0.1:8000/searchQuery",
											requestOptions
										)
											.then((response) => response.json())
											.then((data) => {
												var li = data;
												console.log(li);
												setResults(li);
											});
									}}>
									<SearchIcon />
								</Button>
							</Grid>
						</Grid>
						<Grid container justifyContent={"center"}>
							<Grid item>
								<Typography variant="h6">
									Microphone:{" "}
									{listening ? "listening" : "not listening"}
								</Typography>
							</Grid>
							<Grid item>
								<Button
									onClick={() => {
										if (!isMicOn) {
											SpeechRecognition.startListening();
											setMicStatus(true);
										} else {
											SpeechRecognition.stopListening();
											setMicStatus(false);
										}
									}}>
									{isMicOn && <MicIcon />}
									{!isMicOn && <MicOffIcon />}
								</Button>
							</Grid>
							<Grid item>
								<Button
									onClick={() => {
										setMicStatus(false);
										setQueryText("");
										resetTranscript();
									}}>
									Reset
								</Button>
							</Grid>
						</Grid>

						<br />
						<br />
						{results == [] && (
							<h2>
								No Results Found. Try with different filters
							</h2>
						)}
						{results.map((data, index) => {
							return (
								<ResultCard
									key={index}
									id={data["id"]}
									heading={data["textString"]
										.split(" ")
										.splice(0, 10)
										.join(" ")}
									subtext={data["textString"]
										.split(" ")
										.splice(10, 70)
										.join(" ")}
								/>
							);
						})}
					</div>
				</Grid>
			</Grid>
		</div>
	);
}
function ResultCard({ id, heading, subtext, ...props }) {
	const navigate = useNavigate();
	return (
		<Card
			style={{ marginTop: "20px" }}
			variant="outlined"
			onClick={() => {
				navigate("/pdf?id=" + id);
			}}>
			<CardContent>
				<Typography
					sx={{ fontSize: 14 }}
					color="text.secondary"
					gutterBottom>
					{id}
				</Typography>
				<a href="">
					{" "}
					<Typography variant="h5" component="div">
						{heading}
					</Typography>
				</a>
				<br />
				<Typography variant="body2">{subtext}</Typography>
			</CardContent>
		</Card>
	);
}

export default Home;
