// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed


//error saying firebase is not a function/worked with Carmen and got firebase working, used an older version
//todo left: change lines 34,46,57-60?,80-98?


// 1. Initialize Firebase
// var config = {
//     apiKey: "AIzaSyBr5qF_o7jiquBrHq76BFrGqRVoKcqVErQ",//changed to my firebase api key
//     authDomain: "trainappaj.firebaseapp.com",         //added new auth
//     databaseURL: "https://trainappaj.firebaseio.com", //added new url
//     storageBucket: "gs://trainappaj.appspot.com/" //grabbed .com and took screenshot from where
// };

// firebase.initializeApp(config);

var firebaseConfig = {
    apiKey: "AIzaSyBr5qF_o7jiquBrHq76BFrGqRVoKcqVErQ",
    authDomain: "trainappaj.firebaseapp.com",
    databaseURL: "https://trainappaj.firebaseio.com",
    projectId: "trainappaj",
    storageBucket: "trainappaj.appspot.com",
    messagingSenderId: "301302269873",
    appId: "1:301302269873:web:4365952f285b5a20"
};
 
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var currentTime = moment();
// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainFirst = $("#first-input").val().trim()
    //var trainFirst = moment($("#first-input").val().trim(), "hh:mm:ss").format("X");
    // console.log("==========", trainFirst);
    var trainFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        destination: destination,
        first: trainFirst,
        frequency: trainFrequency
    };

    // Uploads employee data to the database
    database.ref().push(newtrain);

    // Logs everything to // console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);

    alert("train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    // console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().first;
    var frequency = childSnapshot.val().frequency;

    // Employee Info
    // console.log(trainName);
    // console.log(destination);
    // console.log(trainFirst);
    // console.log(frequency);

    // Prettify the employee start
    var trainFirstPretty = moment.unix(trainFirst).format("MM/DD/YYYY");

    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var trainMonths = moment().diff(moment(trainFirst, "X"), "months");
    // console.log(trainMonths);

    // Calculate the total billed rate
    var trainBilled = trainMonths * frequency;
    // console.log(trainBilled);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(trainFirstPretty),
        $("<td>").text(trainMonths),
        $("<td>").text(frequency),
        $("<td>").text(trainBilled)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);


    //re-added moment code
// THE MATH!
    //subtracts the first train time back a year to ensure it's before current time.
    var trainFirstConverted = moment(trainFirst, "hh:mm").subtract("1, years");
    // the time difference between current time and the first train
    var difference = currentTime.diff(moment(trainFirstConverted), "minutes");
    var remainder = difference % frequency;
    var nextArrival = frequency - remainder;
    var minsAway = moment().add(nextArrival, "minutes").format("hh:mm a");

    var newTrain = {
        name: trainName,
        destination: destination,
        trainFirst: trainFirst,
        frequency: frequency,
        min: nextArrival,
        next: minsAway
    }

    // console.log(newTrain);
     database.ref().push(newTrain);

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstInput").val("");
    $("#frequencyInput").val("");

    return false;


});

  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016

  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case
