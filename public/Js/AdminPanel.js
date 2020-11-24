$(document).ready(function() {
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
});
var VideoList = document.getElementById("VideoList");
var UserList = document.getElementById("UserList");
var ReportList = document.getElementById("ReportList");
var ViewStats = document.getElementById("ViewStats");
var ViewMessages = document.getElementById("ViewMessages");
console.log(ViewMessages);

function showUserList() {
    UserList.style.display = "block";
    VideoList.style.display = "none";
    ReportList.style.display = "none";
    ViewStats.style.display = "none";
    ViewMessages.style.display = "none";
}

function showVideoList() {
    UserList.style.display = "none";
    VideoList.style.display = "block";
    ReportList.style.display = "none";
    ViewStats.style.display = "none";
    ViewMessages.style.display = "none";
}

function showReportList() {
    UserList.style.display = "none";
    VideoList.style.display = "none";
    ReportList.style.display = "block";
    ViewStats.style.display = "none";
    ViewMessages.style.display = "none";
}

function viewStats() {
    UserList.style.display = "none";
    VideoList.style.display = "none";
    ReportList.style.display = "none";
    ViewStats.style.display = "block";
    ViewMessages.style.display = "none";
}

function viewMessages() {
    UserList.style.display = "none";
    VideoList.style.display = "none";
    ReportList.style.display = "none";
    ViewStats.style.display = "none";
    ViewMessages.style.display = "block";
}