-- CreateTable
CREATE TABLE `ExecDetails` (
    `email` VARCHAR(191) NOT NULL,
    `position` ENUM('PRESIDENT', 'VICE_PRESIDENT', 'EVENT_COORDINATOR', 'SECRETARY', 'TREASURER') NOT NULL,
    `description` VARCHAR(5000) NOT NULL,
    `selfieURL` VARCHAR(191) NULL,

    INDEX `ExecDetails_email_idx`(`email`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `preferredName` VARCHAR(191) NOT NULL,
    `prefect` VARCHAR(191) NOT NULL,
    `pronouns` VARCHAR(191) NOT NULL,
    `gradYear` INTEGER NOT NULL,
    `position` ENUM('MEMBER', 'EXEC', 'ADMIN') NOT NULL DEFAULT 'MEMBER',
    `registeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `birthday` VARCHAR(191) NOT NULL,
    `referredBy` VARCHAR(191) NULL,
    `sgoSticker` BOOLEAN NOT NULL,
    `givenCredits` INTEGER NOT NULL DEFAULT 0,
    `miscPoints` DOUBLE NOT NULL DEFAULT 0,
    `didOsis` BOOLEAN NOT NULL DEFAULT false,
    `discordID` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL DEFAULT '',
    `phone` INTEGER NOT NULL DEFAULT 0,
    `eventAlerts` BOOLEAN NOT NULL,
    `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_discordID_key`(`discordID`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(4000) NOT NULL,
    `maxPoints` DOUBLE NOT NULL,
    `maxHours` DOUBLE NOT NULL,
    `maxGiveawayEntries` DOUBLE NOT NULL,
    `eventTime` DATETIME(3) NOT NULL,
    `finishTime` DATETIME(3) NOT NULL,
    `registerBefore` BOOLEAN NOT NULL DEFAULT true,
    `closed` BOOLEAN NOT NULL DEFAULT false,
    `limit` INTEGER NULL,
    `imageURL` VARCHAR(191) NULL,
    `serviceLetters` VARCHAR(191) NULL,
    `messageID` VARCHAR(191) NOT NULL,
    `address` VARCHAR(1000) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Event_messageID_key`(`messageID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventAttendee` (
    `userEmail` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `earnedPoints` DOUBLE NOT NULL DEFAULT 0,
    `earnedHours` DOUBLE NOT NULL DEFAULT 0,
    `earnedEntries` DOUBLE NOT NULL DEFAULT 0,
    `registeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `attendedAt` DATETIME(3) NULL,

    INDEX `EventAttendee_userEmail_idx`(`userEmail`),
    INDEX `EventAttendee_eventId_idx`(`eventId`),
    PRIMARY KEY (`userEmail`, `eventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Giveaway` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(4000) NOT NULL,
    `imageURL` VARCHAR(191) NULL,
    `endsAt` DATETIME(3) NOT NULL,
    `ended` BOOLEAN NOT NULL DEFAULT false,
    `maxWinners` INTEGER NOT NULL,
    `prizes` JSON NOT NULL,
    `type` ENUM('FIRST_CLAIM', 'ORDERED_CLAIM', 'RANDOM') NOT NULL,
    `messageID` VARCHAR(191) NOT NULL,
    `winnerMsgID` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Giveaway_messageID_key`(`messageID`),
    UNIQUE INDEX `Giveaway_winnerMsgID_key`(`winnerMsgID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GiveawayEntry` (
    `userEmail` VARCHAR(191) NOT NULL,
    `giveawayId` VARCHAR(191) NOT NULL,
    `won` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NULL,
    `rewardId` INTEGER NULL,
    `entries` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GiveawayEntry_userEmail_idx`(`userEmail`),
    INDEX `GiveawayEntry_giveawayId_idx`(`giveawayId`),
    PRIMARY KEY (`userEmail`, `giveawayId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeletedUsers` (
    `id` VARCHAR(191) NOT NULL,
    `registeredAt` DATETIME(3) NOT NULL,
    `leftAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExecDetails` ADD CONSTRAINT `ExecDetails_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventAttendee` ADD CONSTRAINT `EventAttendee_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventAttendee` ADD CONSTRAINT `EventAttendee_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GiveawayEntry` ADD CONSTRAINT `GiveawayEntry_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GiveawayEntry` ADD CONSTRAINT `GiveawayEntry_giveawayId_fkey` FOREIGN KEY (`giveawayId`) REFERENCES `Giveaway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
