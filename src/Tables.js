import React from "react";
import "./Tables.css"
const Tables = ({ countriess }) => {
	return (
		<div className="table">
			{countriess.map(({ country, cases }) => (
				<tr>
					<td>{country}</td>
					<td>
						<strong>{cases}</strong>
					</td>
				</tr>
			))}
		</div>
	);
};

export default Tables;
