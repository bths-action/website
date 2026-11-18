-- Background event email sends, with progress the edit modal can poll.
CREATE TABLE `EventEmailJob` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'RUNNING',
    `target` INTEGER NOT NULL DEFAULT 0,
    `sent` INTEGER NOT NULL DEFAULT 0,
    `skipped` INTEGER NOT NULL DEFAULT 0,
    `skipAlreadySent` BOOLEAN NOT NULL DEFAULT true,
    `error` VARCHAR(1000) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `finishedAt` DATETIME(3) NULL,

    INDEX `EventEmailJob_eventId_createdAt_idx`(`eventId`, `createdAt`),
    INDEX `EventEmailJob_status_idx`(`status`),
    PRIMARY KEY (`id`),
    CONSTRAINT `EventEmailJob_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
