(function() {
    /**
     * Converts a unix timestamp to a date formatted DD-MM-YYYY
     * Based off https://www.codegrepper.com/code-examples/javascript/javascript+convert+unix+timestamp+to+yyyy-mm-dd
     * @param {number} timestamp the number of seconds since 01/01/1970 (Unix epoch)
     * @returns the date as a string formatted DD-MM-YYYY
     */
    function getDate(timestamp) {
        let date = new Date(timestamp * 1000);

        // month starts from 0, so we add 1
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }

    /**
     * Converts a temperature in Celsius to Fahrenheit.
     * Formula taken from https://www.rapidtables.com/convert/temperature/how-celsius-to-fahrenheit.html
     * @param {number} tempInCelsius the temperature in Celsius to be converted
     * @returns the given temperature converted to Fahrenheit
     */
    function convertCelsiusToFahrenheit(tempInCelsius) {
        return (tempInCelsius * 1.8 + 32).toFixed(2);
    }

    /**
     * Converts meters per second to kilometers per hour
     * Formula taken from https://www.inchcalculator.com/convert/meter-per-second-to-kilometer-per-hour/
     * @param {number} metersPerSecond the value to be converted
     * @returns the given meters per second value converted to kilometers per hour
     */
    function convertMetersPerSecToKiloPerHour(metersPerSecond) {
        return (metersPerSecond * 3.6).toFixed(2);
    }

    /**
     * Converts meters per second to miles per hour
     * Formula taken from https://www.inchcalculator.com/convert/meter-per-second-to-mile-per-hour/
     * @param {number} metersPerSecond the value to be converted
     * @returns the given meters per second value converted to miles per hour
     */
    function convertMetersPerSecToMilesPerHour(metersPerSecond) {
        return (metersPerSecond * 2.236936).toFixed(2);
    }

    /**
     * Converts a given wind direction in degrees to a textual representation
     * Based on https://uni.edu/storm/Wind%20Direction%20slide.pdf
     * @param {number} degree the wind direction degree to be converted to textual representation
     * @returns the textual representation of the given degree
     */
    function getTextualWindDirection(degree) {
        // Enum holding all possible textual representations of wind direction
        const windDirections = {
            N: "Northerly",
            NNE: "North North Easterly",
            NE: "North Easterly",
            ENE: "East North Easterly",
            E: "Easterly",
            ESE: "East South Easterly",
            SE: "South Easterly",
            SSE: "South South Easterly",
            S: "Southerly",
            SSW: "South South Westerly",
            SW: "South Westerly",
            WSW: "West South Westerly",
            W: "Westerly",
            WNW: "West North Westerly",
            NW: "North Westerly",
            NNW: "North North Westerly"
        };

        let result = "";

        if (degree < 20) {
            result = windDirections.N;
        } else if (degree < 30) {
            result = windDirections.NNE;
        } else if (degree < 50) {
            result = windDirections.NE;
        } else if (degree < 70) {
            result = windDirections.ENE;
        } else if (degree < 100) {
            result = windDirections.E;
        } else if (degree < 120) {
            result = windDirections.ESE;
        } else if (degree < 140) {
            result = windDirections.SE;
        } else if (degree < 160) {
            result = windDirections.SSE;
        } else if (degree < 190) {
            result = windDirections.S;
        } else if (degree < 210) {
            result = windDirections.SSW;
        } else if (degree < 230) {
            result = windDirections.SW;
        } else if (degree < 250) {
            result = windDirections.WSW;
        } else if (degree < 280) {
            result = windDirections.W;
        } else if (degree < 300) {
            result = windDirections.WNW;
        } else if (degree < 320) {
            result = windDirections.NW;
        } else if (degree < 340) {
            result = windDirections.NNW;
        } else {
            result = windDirections.N;
        }

        return result;
    }

    $("#countries").change(function() {
        // remove previous weather data
        $("#weather-data").html("");

        // if the country is found, display all its cities in a dropdown
        switch($(this).val()) {
            case "england":
                $("#cities").load("england-cities.html");
                $("#cities").show();
                break;
            case "nireland":
                $("#cities").load("nireland-cities.html");
                $("#cities").show();
                break;
            case "scotland":
                $("#cities").load("scotland-cities.html");
                $("#cities").show();
                break;
            case "wales":
                $("#cities").load("wales-cities.html");
                $("#cities").show();
                break;
            default:
                // remove cities and hide the dropdown as no match was found for the selected country
                $("#cities").html("");
                $("#cities").hide();
        }
    });

    $("#cities").change(function() {
        // remove previous weather data
        $("#weather-data").html("");

        // get the value of the city option selected
        let city = $(this).val();

        // stop the ajax request from being submitted if a city is not selected
        if (city.toLowerCase() == "select a city") {
            return;
        }

        // construct the api request url
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=0bfe6009d1489636c59d5128e1920227`

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(response) {
                // prepare table header row
                let tableHeaderOutput =
                    "<tr>" +
                        "<th>City Name</th>" +
                        "<th>Date</th>" +
                        "<th>Weather Conditions</th>" +
                        "<th>Temperature</th>" +
                        "<th>Wind Speed</th>" +
                        "<th>Wind Direction</th>" +
                        "<th>Weather Icon</th>" +
                    "</tr>";
                
                // declare variable to hold table body row
                let tableBodyOutput = "";

                // construct the table body row with the latest weather data
                tableBodyOutput +=
                    "<tr>" +
                        `<td>${response.name}</td>` +
                        `<td>${getDate(response.dt)}</td>` +
                        `<td>${response.weather[0].description}</td>` +
                        `<td>` +
                            `<p>${response.main.temp}&#8451;</p>` +
                            `<p>${convertCelsiusToFahrenheit(response.main.temp)}&#8457;</p>` +
                            `${response.main.temp > 35 ? '<p class="warning">Warning: high temperature!</p>' : ""}` +
                            `${response.main.temp < -5 ? '<p class="warning">Warning: low temperature!</p>' : ""}` +
                        `</td>` + 
                        `<td>` +
                            `<p>${convertMetersPerSecToKiloPerHour(response.wind.speed)}kph</p>` +
                            `<p>${convertMetersPerSecToMilesPerHour(response.wind.speed)}mph</p>` +
                            `${convertMetersPerSecToMilesPerHour(response.wind.speed) > 50 ? '<p class="warning">Warning: high wind speed!</p>' : ""}` +
                        `</td>` +
                        `<td>` +
                            `<p>${response.wind.deg}&#730;</p>` +
                            `<p>${getTextualWindDirection(response.wind.deg)}</p>` +
                        `</td>` +
                        // Based off https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon
                        `<td><img src="https://openweathermap.org/img/w/${response.weather[0].icon}.png"/></td>` +
                    "</tr>";
                
                $("#weather-data").append(tableHeaderOutput + tableBodyOutput);
            },
            error: function(xhr, error) {
                $("#error-info").html(`<p>${error} | Error code: ${xhr.status}</p>`)
            }
        });
    });
}) ();