package com.language.LanguageApp.Review;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

//Runs on every startup, after Hibernate has updated the schema.
//ddl-auto can add review_log.user_id but can't fill it for existing rows or make it NOT NULL,
//so this does both. Every step is safe to repeat.
@Component
public class ReviewLogUserMigration implements ApplicationRunner {
    private static final Logger logger = LoggerFactory.getLogger(ReviewLogUserMigration.class);

    private final JdbcTemplate jdbcTemplate;

    public ReviewLogUserMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Older logs get the user who owns the reviewed card's deck
        int filled = jdbcTemplate.update("""
                update review_log r
                set user_id = d.user_id
                from card c
                join deck d on d.deck_id = c.deck_id
                where r.card_id = c.card_id and r.user_id is null""");
        if (filled > 0) {
            logger.info("Filled user_id on {} existing review_log rows", filled);
        }

        jdbcTemplate.execute("alter table review_log alter column user_id set not null");
        jdbcTemplate.execute("""
                create index if not exists idx_review_log_user_reviewed_at
                on review_log (user_id, reviewed_at)""");
    }
}
