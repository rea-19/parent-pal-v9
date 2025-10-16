$(document).ready(function() {

    // LOGIC NOT RIGHT, WORKING ON IT
    // Initialize points if not present
    if (!localStorage.getItem("userPoints")) {
        localStorage.setItem("userPoints", "0");
    }

    if (!localStorage.getItem("rewardGoal")) {
        localStorage.setItem("rewardGoal", "20"); // default 5% off
    }

    function updatePointsBar() {
        const points = parseInt(localStorage.getItem("userPoints") || "0");
        const goal = parseInt(localStorage.getItem("rewardGoal") || "20");

        const remaining = Math.max(goal - points, 0);
        $("#points-text").text(`${remaining} points remaining`);
    }

    // Function to add points
    window.addPoints = function(amount) {
        let points = parseInt(localStorage.getItem("userPoints") || "0");
        points += amount;
        localStorage.setItem("userPoints", points);
        updatePointsBar();
    }

    // Function to set a reward goal
    window.setRewardGoal = function(goalPoints) {
        localStorage.setItem("rewardGoal", goalPoints);
        updatePointsBar();
    }

    // Initial update
    updatePointsBar();
});

function updateRewardsPage() {
    $("#current-points").text(localStorage.getItem("userPoints") || "0");
    $("#reward-goal-select").val(localStorage.getItem("rewardGoal") || "20");
}

$("#reward-goal-select").on('change', function() {
    setRewardGoal(parseInt($(this).val()));
});

updateRewardsPage();
