const button = document.getElementById("buttoncircle");
const buttonimg = document.getElementById("button");

const body = document.body;
buttonimg.addEventListener("click", function () {
  if (body.classList.contains("dark")) {
    body.classList.replace("dark", "light");
    button.style.transform = "translateX(20px)";
  } else {
    body.classList.replace("light", "dark");
    button.style.transform = "translateX(0)";
  }
});

fetch("http://localhost:3000/socialMedia")
  .then((response) => response.json())
  .then((data) => {
    // Update total followers
    const totalFollowers = data.reduce(
      (total, platform) => total + platform.followers,
      0
    );
    document.getElementById("total-followers").textContent =
      totalFollowers.toLocaleString();

    // Update social media statistics
    data.forEach((platform) => {
      updatePlatformStats(platform.platform, platform);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

fetch("http://localhost:3000/overview")
  .then((response) => response.json())
  .then((data) => {
    // Update overview statistics
    updateOverviewStats(data);
  })
  .catch((error) => console.error("Error fetching data:", error));

function updatePlatformStats(platform, stats) {
  const platformElement = document.querySelector(`.${platform}`);

  // Update the username and platform icon
  platformElement.querySelector(
    `.header${platform} span:nth-child(2)`
  ).textContent = stats.username;
  platformElement.querySelector(
    `.header${platform} span:nth-child(1) img`
  ).src = `images/icon-${platform}.svg`;

  platformElement.querySelector(".no").textContent =
    stats.followers.toLocaleString();
  platformElement.querySelector(
    ".today"
  ).textContent = `${stats.todayChange} Today`;

  const changeIcon = platformElement.querySelector(".day img");
  changeIcon.src =
    stats.todayChange > 0 ? "images/icon-up.svg" : "images/icon-down.svg";

  const todayElement = platformElement.querySelector(".today");
  todayElement.classList.toggle("today-y", stats.todayChange < 0);
  todayElement.textContent = `${stats.todayChange} Today`;
}

function updateOverviewStats(overview) {
  const boxes = document.querySelectorAll(".box");
  overview.forEach((stat, index) => {
    const box = boxes[index];
    box.querySelector(".top span:first-child").textContent = stat.metric;
    box.querySelector(
      ".top span:last-child img"
    ).src = `images/icon-${stat.platform}.svg`;
    box.querySelector(".bottom span:first-child").textContent =
      stat.value.toLocaleString();
    box.querySelector(".bottom span:last-child").innerHTML = `<img src="${
      stat.changeDirection === "up"
        ? "images/icon-up.svg"
        : "images/icon-down.svg"
    }" alt="" /> ${stat.change}%`;
    box.querySelector(".bottom span:last-child").style.color =
      stat.changeDirection === "up" ? "green" : "red";
  });
}
