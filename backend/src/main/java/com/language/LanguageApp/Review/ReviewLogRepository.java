package com.language.LanguageApp.Review;

import java.time.Instant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewLogRepository extends JpaRepository<ReviewLog, Long> {

    //Counted (non-practice) reviews the user did in [start, end), new cards included
    @Query("""
            select count(r) from ReviewLog r
            where r.user.usersId = :userId and r.practice = false
              and r.reviewedAt >= :start and r.reviewedAt < :end""")
    long countReviewsBetween(@Param("userId") Long userId, @Param("start") Instant start,
            @Param("end") Instant end);

    //Cards whose first ever counted review happened in [start, end): the new cards introduced that day
    @Query("""
            select count(distinct r.card) from ReviewLog r
            where r.user.usersId = :userId and r.practice = false
              and r.reviewedAt >= :start and r.reviewedAt < :end
              and not exists (
                select 1 from ReviewLog earlier
                where earlier.card = r.card and earlier.practice = false and earlier.reviewedAt < :start)""")
    long countNewCardsIntroducedBetween(@Param("userId") Long userId, @Param("start") Instant start,
            @Param("end") Instant end);
}
