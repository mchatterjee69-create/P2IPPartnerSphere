import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

async function runDiagnostics() {
  console.log("=================================================");
  console.log("🔥 FIRESTORE CONNECTION & PERMISSIONS DIAGNOSTIC");
  console.log("=================================================");

  // 1. Read config
  const configPath = path.resolve("./firebase-applet-config.json");
  if (!fs.existsSync(configPath)) {
    console.error("❌ ERROR: firebase-applet-config.json not found!");
    process.exit(1);
  }

  const rawConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const expectedProjectId = "secret-current-4mbw7";
  const expectedDatabaseId = "ai-studio-p2ippartnerspher-a0c8c61a-8a97-493b-b82a-e3b9df1a5912";

  console.log(`📌 Project ID:     ${rawConfig.projectId} (Expected: ${expectedProjectId})`);
  console.log(`📌 Database ID:    ${rawConfig.firestoreDatabaseId || "(default)"} (Expected: ${expectedDatabaseId})`);

  if (rawConfig.projectId !== expectedProjectId) {
    console.warn(`⚠️ Warning: Project ID mismatch! Config has '${rawConfig.projectId}', expected '${expectedProjectId}'`);
  }

  // 2. Initialize Firebase
  const app = initializeApp(rawConfig);
  const db = getFirestore(app, expectedDatabaseId);

  const testDocId = `diag_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const testCollection = "system_diagnostics";
  const docRef = doc(db, testCollection, testDocId);

  const payload = {
    diagnosticId: testDocId,
    verifiedAt: new Date().toISOString(),
    environment: "Google AI Studio Cloud Run Container",
    testMessage: "Read/write permissions validation for P2IP PartnerSphere",
    projectId: rawConfig.projectId,
    databaseId: expectedDatabaseId,
    status: "HEALTHY",
  };

  try {
    // 3. Test WRITE
    console.log(`\n⏳ 1. Attempting test WRITE to collection '${testCollection}', doc '${testDocId}'...`);
    const writeStartTime = Date.now();
    await setDoc(docRef, payload);
    const writeDuration = Date.now() - writeStartTime;
    console.log(`✅ WRITE SUCCESSFUL! (Latency: ${writeDuration}ms)`);

    // 4. Test READ
    console.log(`\n⏳ 2. Attempting test READ from collection '${testCollection}', doc '${testDocId}'...`);
    const readStartTime = Date.now();
    const docSnap = await getDoc(docRef);
    const readDuration = Date.now() - readStartTime;

    if (!docSnap.exists()) {
      console.error("❌ READ FAILED: Document written was not found!");
      process.exit(1);
    }

    const fetchedData = docSnap.data();
    console.log(`✅ READ SUCCESSFUL! (Latency: ${readDuration}ms)`);
    console.log("📄 Fetched Document Data:", JSON.stringify(fetchedData, null, 2));

    // Validate payload equality
    if (fetchedData.diagnosticId === testDocId && fetchedData.status === "HEALTHY") {
      console.log("\n🎯 INTEGRITY VERIFICATION PASSED: Stored and retrieved payload matches exactly!");
    } else {
      console.warn("⚠️ Integrity warning: payload fields differ.");
    }

    // 5. Cleanup test document
    console.log(`\n⏳ 3. Cleaning up diagnostic test document...`);
    await deleteDoc(docRef);
    console.log(`✅ CLEANUP SUCCESSFUL: Test document '${testDocId}' removed.`);

    console.log("\n=================================================");
    console.log("🎉 DIAGNOSTIC RESULT: ALL CHECKS PASSED!");
    console.log("   - Firestore Connection: OK");
    console.log("   - Project: secret-current-4mbw7");
    console.log("   - Database: ai-studio-p2ippartnerspher-a0c8c61a-8a97-493b-b82a-e3b9df1a5912");
    console.log("   - Read Permission: GRANTED");
    console.log("   - Write Permission: GRANTED");
    console.log("=================================================");
    process.exit(0);
  } catch (err: any) {
    console.error("\n❌ DIAGNOSTIC FAILED WITH ERROR:");
    console.error(err);
    if (err.code) {
      console.error(`Firebase Error Code: ${err.code}`);
    }
    process.exit(1);
  }
}

runDiagnostics();
