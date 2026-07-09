-- CreateTable
CREATE TABLE "Lead" (
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
    "priorityLevel" TEXT NOT NULL DEFAULT 'Worth Testing',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Lead_category_idx" ON "Lead"("category");

-- CreateIndex
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");

-- CreateIndex
CREATE INDEX "Lead_priorityLevel_idx" ON "Lead"("priorityLevel");

-- CreateIndex
CREATE INDEX "Lead_followUpDate_idx" ON "Lead"("followUpDate");
