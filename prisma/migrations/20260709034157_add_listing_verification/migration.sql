-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "website" TEXT,
    "location" TEXT,
    "contactName" TEXT,
    "contactTitle" TEXT,
    "contactEmail" TEXT,
    "linkedinUrl" TEXT,
    "warmIntroSource" TEXT,
    "notes" TEXT,
    "estimatedBudget" TEXT,
    "urgency" INTEGER NOT NULL DEFAULT 3,
    "remoteFriendly" BOOLEAN NOT NULL DEFAULT true,
    "abilityToPay" INTEGER NOT NULL DEFAULT 3,
    "fitWithMyBackground" INTEGER NOT NULL DEFAULT 3,
    "needForAiProductHelp" INTEGER NOT NULL DEFAULT 3,
    "relevanceToLcs" INTEGER NOT NULL DEFAULT 3,
    "relevanceToDecisionIntelligence" INTEGER NOT NULL DEFAULT 3,
    "familyOfficeOrWealthFit" INTEGER NOT NULL DEFAULT 3,
    "institutionalEducationFit" INTEGER NOT NULL DEFAULT 3,
    "accessibilityOfDecisionMaker" INTEGER NOT NULL DEFAULT 3,
    "warmIntroStrength" INTEGER NOT NULL DEFAULT 1,
    "remoteOrFractionalFit" INTEGER NOT NULL DEFAULT 3,
    "fitScore" INTEGER NOT NULL DEFAULT 0,
    "stage" TEXT NOT NULL DEFAULT 'Found',
    "nextAction" TEXT,
    "lastContactedDate" DATETIME,
    "followUpDate" DATETIME,
    "suggestedOffer" TEXT,
    "personalizedAngle" TEXT,
    "monthlyRevenuePotential" TEXT,
    "objectionRisk" TEXT,
    "confidenceLevel" TEXT,
    "sourceUrl" TEXT,
    "sourceType" TEXT,
    "sourceLastScrapedAt" DATETIME,
    "sourceConfidence" INTEGER NOT NULL DEFAULT 1,
    "canonicalUrl" TEXT,
    "atsProvider" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "atsExternalId" TEXT,
    "atsBoardToken" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "lastVerifiedAt" DATETIME,
    "lastCheckedAt" DATETIME,
    "staleDetectedAt" DATETIME,
    "staleReason" TEXT,
    "checkFailCount" INTEGER NOT NULL DEFAULT 0,
    "priorityLevel" TEXT NOT NULL DEFAULT 'Worth Testing',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Lead" ("abilityToPay", "accessibilityOfDecisionMaker", "category", "companyName", "confidenceLevel", "contactEmail", "contactName", "contactTitle", "createdAt", "estimatedBudget", "familyOfficeOrWealthFit", "fitScore", "fitWithMyBackground", "followUpDate", "id", "institutionalEducationFit", "lastContactedDate", "linkedinUrl", "location", "monthlyRevenuePotential", "needForAiProductHelp", "nextAction", "notes", "objectionRisk", "personalizedAngle", "priorityLevel", "relevanceToDecisionIntelligence", "relevanceToLcs", "remoteFriendly", "remoteOrFractionalFit", "sourceConfidence", "sourceLastScrapedAt", "sourceType", "sourceUrl", "stage", "suggestedOffer", "updatedAt", "urgency", "warmIntroSource", "warmIntroStrength", "website") SELECT "abilityToPay", "accessibilityOfDecisionMaker", "category", "companyName", "confidenceLevel", "contactEmail", "contactName", "contactTitle", "createdAt", "estimatedBudget", "familyOfficeOrWealthFit", "fitScore", "fitWithMyBackground", "followUpDate", "id", "institutionalEducationFit", "lastContactedDate", "linkedinUrl", "location", "monthlyRevenuePotential", "needForAiProductHelp", "nextAction", "notes", "objectionRisk", "personalizedAngle", "priorityLevel", "relevanceToDecisionIntelligence", "relevanceToLcs", "remoteFriendly", "remoteOrFractionalFit", "sourceConfidence", "sourceLastScrapedAt", "sourceType", "sourceUrl", "stage", "suggestedOffer", "updatedAt", "urgency", "warmIntroSource", "warmIntroStrength", "website" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE INDEX "Lead_category_idx" ON "Lead"("category");
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");
CREATE INDEX "Lead_priorityLevel_idx" ON "Lead"("priorityLevel");
CREATE INDEX "Lead_followUpDate_idx" ON "Lead"("followUpDate");
CREATE INDEX "Lead_sourceUrl_idx" ON "Lead"("sourceUrl");
CREATE INDEX "Lead_verificationStatus_lastCheckedAt_idx" ON "Lead"("verificationStatus", "lastCheckedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
