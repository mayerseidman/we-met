-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "activeFestivalId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Festival" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Festival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "festivalId" TEXT NOT NULL,
    "note" TEXT,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FestivalParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "festivalId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FestivalParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_whatsapp_key" ON "User"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "User_instagram_key" ON "User"("instagram");

-- CreateIndex
CREATE UNIQUE INDEX "User_activeFestivalId_key" ON "User"("activeFestivalId");

-- CreateIndex
CREATE UNIQUE INDEX "FestivalParticipant_userId_festivalId_year_key" ON "FestivalParticipant"("userId", "festivalId", "year");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeFestivalId_fkey" FOREIGN KEY ("activeFestivalId") REFERENCES "FestivalParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FestivalParticipant" ADD CONSTRAINT "FestivalParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FestivalParticipant" ADD CONSTRAINT "FestivalParticipant_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
