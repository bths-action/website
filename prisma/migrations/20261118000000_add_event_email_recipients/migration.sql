-- Track who has already received an event's email so resends can skip them.
CREATE TABLE `EventEmailRecipient` (
    `eventId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(320) NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`eventId`, `email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `EventEmailRecipient`
    ADD CONSTRAINT `EventEmailRecipient_eventId_fkey`
    FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
