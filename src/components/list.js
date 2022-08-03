import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { propertyDataApi } from "../api/propertyDataApi";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Record = (props) => (
    <tr>
        <td>
            <div className="form-check">
                <input type="radio" className="form-check-input" id={ `input_${props.record.propertyId}` }
                    checked={ props.selectedPropertyData.propertyId === props.record.propertyId }
                    onChange={ props.onPropertyDataSelect }
                />
                <label className="form-check-label" htmlFor={ `input_${props.record.propertyId}` }>
                    { props.record.propertyId }
                </label>
            </div>
        </td>
        <td>
            <label className="form-check-label" htmlFor={ `input_${props.record.propertyId}` }>
                { props.record.propertyName }
            </label>
        </td>
    </tr>
);

export default function List () {
    const [viewModel, setViewModel] = useState({
        records: [],
        chartData: {},
        selectedPropertyData: null
    });

    const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // This method fetches the records from the database.
    useEffect(() => {
        async function getRecords () {
            const records = await propertyDataApi.getAll();
            let chartData = {};
            let selectedPropertyData = null;
            records.forEach((record) => {
                chartData[record.propertyId] = {
                    expense: longMonths.map((month) => record.expense[month]),
                    income: longMonths.map((month) => record.income[month])
                };
            });

            if (records.length
                && !selectedPropertyData
            ) {
                selectedPropertyData = records[0];
            }

            setViewModel({
                records: records,
                chartData: chartData,
                selectedPropertyData: selectedPropertyData
            });
        }

        getRecords();
        return;
    }, [viewModel.records.length]);

    // This method will delete a record
    async function deleteRecord (id) {
        const deleted = await propertyDataApi.delete(id);
        if (!deleted)
            return;

        const newRecords = viewModel.records.filter((el) => el.propertyId !== id);
        const selectedPropertyData = viewModel.selectedPropertyData && viewModel.selectedPropertyData.propertyId === id ? null : viewModel.selectedPropertyData;
        if (newRecords.length
            && !selectedPropertyData
        ) {
            selectedPropertyData = newRecords[0];
        }

        setViewModel({
            records: newRecords,
            chartData: viewModel.chartData,
            selectedPropertyData: selectedPropertyData
        });
    }

    // This method will map out the records on the table
    function recordList () {
        return viewModel.records.map((record) => {
            return (
                <Record
                    record={ record }
                    selectedPropertyData={ viewModel.selectedPropertyData }
                    deleteRecord={ () => deleteRecord(record.propertyId) }
                    key={ record._id }
                    onPropertyDataSelect={ () => setViewModel({
                        records: viewModel.records,
                        chartData: viewModel.chartData,
                        selectedPropertyData: record
                    }) }
                />
            );
        });
    }

    // This function render bar chart
    function barChart () {
        return (
            <Bar
                data={ {
                    // Name of the variables on x-axies for each bar
                    labels: shortMonths,
                    datasets: ["expense", "income"].map((type) => {
                        let bgColor, label;
                        switch (type) {
                            case "expense":
                                bgColor = "#FDA245";
                                label = "Expense";
                                break;

                            case "income":
                                bgColor = "#1BAF77";
                                label = "Income";
                                break;
                        }

                        return {
                            // Label for bars
                            label: label,
                            // Data or value of your each variable
                            data: viewModel.selectedPropertyData ? viewModel.chartData[viewModel.selectedPropertyData.propertyId.toString()][type] : [],
                            // Color of each bar
                            backgroundColor: bgColor,
                            // Border color of each bar
                            borderColor: bgColor,
                            borderWidth: 0.5,
                        };
                    }),
                } }
                // Height of graph
                height={ "400" }
                options={ {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            fontSize: 15,
                            labels: {
                                fontSize: 15
                            }
                        },
                    }
                } }
            />
        );
    }

    // This following section will display the table with the records of individuals.
    return (
        <div class="container-fluid mt-5">
            <div class="row">
                <div class="col-6">
                    <h3 class="col-12">Property Data</h3>
                    <table className="table table-striped" style={ { marginTop: 20 } }>
                        <thead>
                            <tr>
                                <th>Property ID</th>
                                <th>Property Name</th>
                            </tr>
                        </thead>
                        <tbody>{ recordList() }</tbody>
                    </table>
                </div>
                <div class="col-6">
                    <h3 class="col-12">{ viewModel.selectedPropertyData ? viewModel.selectedPropertyData.propertyName : '' }</h3>
                    <div>
                        { barChart() }
                    </div>
                </div>
            </div>
        </div>
    );
}