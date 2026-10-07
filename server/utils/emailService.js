// Simulated Email Service (Nodemailer mock)
// In a production environment, you would use actual SMTP credentials here.

const sendAlertEmail = async (adminEmail, anomalyData) => {
    console.log("\n=======================================================");
    console.log("🚨 [EMAIL ALERT DISPATCHED] 🚨");
    console.log(`To: ${adminEmail}`);
    console.log("Subject: CRITICAL: Severe Routing Bias Detected");
    console.log("-------------------------------------------------------");
    console.log(`Dear Administrator,\n`);
    console.log(`The TORFA AI Analytics Engine has detected a severe routing anomaly.`);
    console.log(`Status: ${anomalyData.summary}`);
    console.log(`Prediction: ${anomalyData.prediction}`);
    console.log(`NSE Recent Anomalies: ${anomalyData.nseMetrics.recentAnomalies}`);
    console.log(`BSE Recent Anomalies: ${anomalyData.bseMetrics.recentAnomalies}`);
    console.log(`\nPlease log into the Admin Dashboard immediately to investigate.`);
    console.log("=======================================================\n");

    return true; // Simulate success
};

module.exports = { sendAlertEmail };
