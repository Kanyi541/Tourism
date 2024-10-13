document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bookingForm");
    const destinationSelect = document.getElementById("destination");
    const activitiesSelect = document.getElementById("activities");
    const guestsInput = document.getElementById("guests");
    const kidsInput = document.getElementById("kids");
    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");
    const totalAmountInput = document.getElementById("totalAmount");

    // Define the activities for each destination
    const activitiesByDestination = {
        "masai-mara": [
            { value: "game-drive", text: "Game Drive - $100", cost: 100 },
            { value: "hot-air-balloon", text: "Hot Air Balloon Safari - $200", cost: 200 }
        ],
        "amboseli": [
            { value: "walking-safari", text: "Walking Safari - $75", cost: 75 },
            { value: "game-drive", text: "Game Drive - $100", cost: 100 }
        ],
        "tsavo": [
            { value: "game-drive", text: "Game Drive - $100", cost: 100 },
            { value: "bird-watching", text: "Bird Watching - $50", cost: 50 }
        ]
    };

    // Function to populate activities based on destination selection
    function populateActivities() {
        const selectedDestination = destinationSelect.value;
        const activities = activitiesByDestination[selectedDestination] || [];

        // Clear the current options in the activities select
        activitiesSelect.innerHTML = '';

        // Populate new activities
        activities.forEach(activity => {
            const option = document.createElement("option");
            option.value = activity.value;
            option.textContent = activity.text;
            option.setAttribute("data-cost", activity.cost);
            activitiesSelect.appendChild(option);
        });

        calculateTotal(); // Recalculate the total when destination changes
    }

    // Function to calculate the number of days between two dates
    function calculateDaysDifference() {
        const checkinDate = new Date(checkinInput.value);
        const checkoutDate = new Date(checkoutInput.value);

        // Check if both dates are valid
        if (!isNaN(checkinDate.getTime()) && !isNaN(checkoutDate.getTime())) {
            const timeDifference = checkoutDate.getTime() - checkinDate.getTime();
            const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert time to days
            return dayDifference > 0 ? dayDifference : 0; // Ensure no negative days
        }
        return 0;
    }

    // Function to calculate the total cost
    function calculateTotal() {
        let total = 0;

        // Get the number of days for the trip
        const numDays = calculateDaysDifference();

        // Get destination cost
        const selectedDestination = destinationSelect.options[destinationSelect.selectedIndex];
        const destinationCost = parseFloat(selectedDestination.getAttribute("data-cost"));

        // Add destination cost for adults and children
        const numAdults = parseInt(guestsInput.value);
        const numKids = parseInt(kidsInput.value);

        const adultDestinationCost = numAdults * destinationCost * numDays;
        const kidDestinationCost = numKids * (destinationCost / 2) * numDays; // 50% discount for kids

        total += adultDestinationCost + kidDestinationCost;

        // Get activity costs
        const selectedActivities = Array.from(activitiesSelect.selectedOptions);
        selectedActivities.forEach(activity => {
            const activityCost = parseFloat(activity.getAttribute("data-cost"));

            const adultActivityCost = numAdults * activityCost * numDays;
            const kidActivityCost = numKids * (activityCost / 2) * numDays; // 50% discount for kids

            total += adultActivityCost + kidActivityCost;
        });

        // Display the total amount
        totalAmountInput.value = `$${total.toFixed(2)}`;
    }

    // Event listener to update activities when a destination is selected
    destinationSelect.addEventListener("change", populateActivities);

    // Event listeners to update the total when inputs change
    activitiesSelect.addEventListener("change", calculateTotal);
    guestsInput.addEventListener("input", calculateTotal);
    kidsInput.addEventListener("input", calculateTotal);
    checkinInput.addEventListener("input", calculateTotal);
    checkoutInput.addEventListener("input", calculateTotal);

    // Initial calculation
    populateActivities();
});
