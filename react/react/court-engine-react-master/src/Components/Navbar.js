import React from "react";
import "./Navbar.css";
import logo from "./logo-small.jpeg";
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	Grid,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";

function dateFormat(date, format) {
	//parse the input date

	//extract the parts of the date
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	//replace the month
	format = format.replace("MM", month.toString().padStart(2, "0"));

	//replace the year
	if (format.indexOf("yyyy") > -1) {
		format = format.replace("yyyy", year.toString());
	} else if (format.indexOf("yy") > -1) {
		format = format.replace("yy", year.toString().substr(2, 2));
	}

	//replace the day
	format = format.replace("dd", day.toString().padStart(2, "0"));

	return format;
}

function Navbar({ filterMap, setMap, callSearchApi, ...props }) {
	const [pet, setPet] = useState("");
	const [res, setRes] = useState("");
	const [section, setSection] = useState("");
	const [startYear, setStartYear] = useState("");
	const [endYear, setEndYear] = useState("");
	const [judgementNumber, setjudgementNumber] = useState("");
	const [courtRadio, setCourtRadio] = useState("All");
	const [highCourtCity, setHighCourtCity] = useState("");
	return (
		<Grid>
			<Box m={4}></Box>
			<Typography>Use ',' for filtering multiple values</Typography>
			<Box m={2}></Box>
			<Grid container>
				<Grid item>
					<div>
						<Typography variant="h6">From Year</Typography>
						<TextField
							value={startYear}
							onChange={(event) => {
								setStartYear(event.target.value);
							}}
							type={"number"}
							inputProps={{
								style: {
									padding: 5,
								},
							}}
							style={{ width: "70px" }}
						/>
					</div>
				</Grid>
				<Box m={2}></Box>
				<Grid item>
					<div>
						<Typography variant="h6">To Year</Typography>
						<TextField
							value={endYear}
							onChange={(event) => {
								setEndYear(event.target.value);
							}}
							type={"number"}
							inputProps={{
								style: {
									padding: 5,
								},
							}}
							style={{ width: "70px" }}
						/>
					</div>
				</Grid>
			</Grid>
			<Box m={2}></Box>
			<RadioGroup
				onChange={(event) => {
					setCourtRadio(event.target.value);
				}}
				value={courtRadio}
				row
				aria-labelledby="demo-row-radio-buttons-group-label"
				name="row-radio-buttons-group">
				<FormControlLabel
					value="High Court"
					control={<Radio />}
					label="High Court"
				/>
				<FormControlLabel
					value="Supreme Court"
					control={<Radio />}
					label="Supreme Court"
				/>
				<FormControlLabel value="All" control={<Radio />} label="All" />
			</RadioGroup>
			{courtRadio === "High Court" && (
				<FormControl>
					<InputLabel id="demo-simple-select-label">Place</InputLabel>
					<Select
						style={{ width: "100%" }}
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={highCourtCity}
						label="Place"
						onChange={(event) => {
							setHighCourtCity(event.target.value);
						}}>
						{highCourtList.map((value, index, array) => {
							return (
								<MenuItem key={index} value={value}>
									{value}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			)}
			<FilterField
				name="Petitioner"
				value={pet}
				setValue={setPet}
				helperText={""}
			/>
			<FilterField
				name="Respondent"
				value={res}
				setValue={setRes}
				helperText={""}
			/>
			<FilterField
				name="Section"
				value={section}
				setValue={setSection}
				helperText={"Sample format : 32-crpc"}
			/>
			<FilterField
				name="Judgement number"
				value={judgementNumber}
				setValue={setjudgementNumber}
				helperText={"26 of 2022"}
			/>

			<Box m={2}></Box>
			<Grid container>
				<Grid item>
					<Button
						variant="text"
						onClick={() => {
							setPet("");
							setStartYear("");
							setEndYear("");
							setRes("");
							setSection("");
							setjudgementNumber("");
							setCourtRadio("All");
							setHighCourtCity("");
						}}>
						Clear
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							var petList = pet.split(",");
							var resList = res.split(",");

							var sectionList = section.split(",");
							console.log(petList);
							//court type
							//court location
							//judgement number
							filterMap["petitioner"] = petList;
							filterMap["respondent"] = resList;
							filterMap["fromYear"] = startYear;
							filterMap["toYear"] = endYear;
							filterMap["section"] = sectionList;
							if (courtRadio == "All") {
								filterMap["court"] = [
									"high court",
									"supreme court",
								];
							} else {
								filterMap["court"] = [courtRadio];
							}
							filterMap["highCourtLocation"] = highCourtCity;
							filterMap["JudgementNumber"] = judgementNumber;

							setMap(filterMap);
							callSearchApi();
						}}>
						Apply
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}

function FilterField({ name, helperText, value, setValue, ...props }) {
	return (
		<Grid style={{ marginTop: "10px" }}>
			<Grid item>
				<Typography variant="h6">{name}</Typography>
			</Grid>
			<Grid item style={{ marginTop: "5px" }}>
				<TextField
					value={value}
					onFocus={(event) => {
						console.log(event);
					}}
					placeholder={helperText}
					onChange={(event) => {
						setValue(event.target.value);
					}}
					inputProps={{
						style: {
							padding: 5,
						},
					}}
					id="outlined-basic"
					variant="outlined"
				/>
			</Grid>
		</Grid>
	);
}

const highCourtList = [
	"Bombay",
	"Kolkata",
	"Madras",
	"Allahabad",
	"Karnataka",
	"Patna",
	"Guwahati",
	"Odisha",
	"Rajasthan",
	"Madhya Pradesh",
	"Kerala",
	"Gujarat",
	"Delhi",
	"Himachal Pradesh",
	"Punjab & Haryana",
	"Sikkim",
	"Chattisgarh",
	"Uttarakhand",
	"Jharkhand",
	"Tripura",
	"Manipur",
	"Meghalaya",
	"Telangana",
	"Andhra Pradesh",
	"Jammu & Kashmir and Ladakh",
];

export default Navbar;
