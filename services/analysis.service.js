
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { randomUUID } = require("crypto");

const PYTHON_PATH = path.join(
    process.env.LOCALAPPDATA,
    "Programs",
    "Python",
    "Python312",
    "python.exe"
);

const AI_ENGINE_DIR =
    "C:\\Users\\najla\\Downloads\\Flawless-main\\Flawless-main\\ai-engine";

function analyzeImage(image) {
    return new Promise((resolve, reject) => {
        if (!image || !Buffer.isBuffer(image)) {
            return reject(new Error("A valid image buffer is required."));
        }

        const imagePath = path.join(
            os.tmpdir(),
            `flawless-${randomUUID()}.png`
        );

        fs.writeFile(imagePath, image, (writeError) => {
            if (writeError) {
                return reject(writeError);
            }

            const scriptPath = path.join(AI_ENGINE_DIR, "predict_acne.py");

            const pythonProcess = spawn(
                PYTHON_PATH,
                [scriptPath, imagePath],
                {
                    cwd: AI_ENGINE_DIR,
                    windowsHide: true
                }
            );

            let stdout = "";
            let stderr = "";

            pythonProcess.stdout.on("data", (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on("data", (data) => {
                stderr += data.toString();
            });

            pythonProcess.on("error", (error) => {
                fs.unlink(imagePath, () => {});
                reject(error);
            });

            pythonProcess.on("close", (code) => {
                fs.unlink(imagePath, () => {});

                if (code !== 0) {
                    console.error("Python prediction error:", stderr);
                    return reject(new Error("AI prediction failed."));
                }

                const predictionMatch = stdout.match(
                    /Prediction:\s*Level\s*(\d+)\s*-\s*([^(]+)\s*\(([\d.]+)%\)/i
                );

                if (!predictionMatch) {
                    console.error("Unexpected Python output:", stdout);
                    return reject(new Error("Could not read the AI prediction."));
                }

                const level = Number(predictionMatch[1]);
                const severity = predictionMatch[2].trim();
                const confidence = Number(predictionMatch[3]);
console.log("AI LEVEL:", level);
console.log("AI SEVERITY:", severity);
console.log("AI CONFIDENCE:", confidence);
console.log("AI RESULT OBJECT:", {
    acneDetected: level > 0,
    acneLevel: severity,
    acneSeverityLevel: level,
    confidence
});
                resolve({
                    acneDetected: level > 0,
                    acneLevel: severity,
                    acneSeverityLevel: level,
                    confidence
                });
            });
        });
    });
}

module.exports = { analyzeImage };
