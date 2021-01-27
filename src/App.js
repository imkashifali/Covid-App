import React, { useState, useEffect } from "react";
import "./App.css";
import {
	CardContent,
	Card,
	MenuItem,
	FormControl,
	Select,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Tables from "./Tables";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

import { sortData } from "./util";

function App() {
	const [countriess, setCountriess] = useState([]);
	const [country, setcountry] = useState("world");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, settableData] = useState([]);

	useEffect(() => {
		fetch("https://www.disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		const getCountiresData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));

					const sortedData = sortData(data);
					settableData(sortedData);
					setCountriess(countries);
				});
		};
		getCountiresData();
	}, []);

	const onCountryChange = async (e) => {
		const countryCode = e.target.value;

		setcountry(countryCode);
		const url =
			countryCode === "worldwide"
				? "https://www.disease.sh/v3/covid-19/all"
				: `https://www.disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setcountry(countryCode);
				setCountryInfo(data);
			});
	};
	console.log("CountryInfo >>>>>>>>", countryInfo);
	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>Covid Track</h1>

					<FormControl className="app_dropdown">
						<Select
							variant="outlined"
							onChange={onCountryChange}
							value={country}
						>
							<MenuItem value="worldwide" >worldwide</MenuItem>

							{countriess.map((country) => (
								<MenuItem value={country.value}>{country.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="app__stats">
					<InfoBox
						title="Coronvirus"
						cases={countryInfo.todayCases}
						total={countryInfo.cases}
					/>
					<InfoBox
						title="Recover"
						cases={countryInfo.todayRecovered}
						total={countryInfo.recovered}
					/>
					<InfoBox
						title="Death"
						cases={countryInfo.todayDeaths}
						total={countryInfo.deaths}
					/>
				</div>
			</div>
			<Card className="app__right">
				<CardContent>
					<h3>Live Cases by Country</h3>

					<Tables countriess={tableData} />
					<h3>World new cases</h3>
					<LineGraph />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
