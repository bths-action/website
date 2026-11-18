-- At most one running job per event. The key is set to the event id while a
-- send is running and cleared once it finishes, so the unique index acts as a
-- partial index (MySQL/TiDB allow repeated NULLs).
ALTER TABLE `EventEmailJob`
    ADD COLUMN `activeEventId` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `EventEmailJob_activeEventId_key`
    ON `EventEmailJob`(`activeEventId`);
