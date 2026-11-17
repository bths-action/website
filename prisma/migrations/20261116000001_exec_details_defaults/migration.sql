-- Exec details are now created automatically when a member is promoted, so
-- every field needs a usable default until they fill in their exec profile.
ALTER TABLE `ExecDetails` MODIFY `position` ENUM('PRESIDENT', 'VICE_PRESIDENT', 'EVENT_COORDINATOR', 'SECRETARY', 'TREASURER') NULL,
    MODIFY `description` VARCHAR(5000) NOT NULL DEFAULT '';
