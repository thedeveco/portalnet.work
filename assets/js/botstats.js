async function fetchBotStats() {
  try {
    const response = await fetch("https://api.portalnet.work/stats");
    const data = await response.json();
    document.getElementById("totalServers").textContent =
      data.currentGuildCount.toLocaleString();
    document.getElementById("comptotalServers").textContent = formatServerCount(
      data.currentGuildCount
    );
    document.getElementById("totalUsers").textContent =
      data.totalUserCount.toLocaleString();
    document.getElementById("comptotalUsers").textContent = formatUserCount(
      data.totalUserCount
    );
    document.getElementById("totalNetwork").textContent =
      data.networkServersCount.toLocaleString();
    //document.getElementById("comptotalNetwork").textContent = formatServerCount(
    //  data.networkServersCount
    // );
    document.getElementById("totalMessages").textContent =
      data.messagecount.toLocaleString();
    document.getElementById("comptotalMessages").textContent =
      formatMessageCount(data.messagecount);
  } catch (error) {
    console.error("Failed to fetch bot stats:", error);
  }
}

function formatServerCount(count) {
  if (count >= 100) {
    return Math.floor(count / 10) * 10 + "+";
  }
  return count.toLocaleString();
}

function formatUserCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k+";
  }
  return count.toLocaleString();
}

function formatMessageCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k+";
  }
  return count.toLocaleString();
}

window.onload = fetchBotStats;
