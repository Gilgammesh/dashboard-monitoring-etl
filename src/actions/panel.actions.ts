"use server";

import prisma from "@/lib/prisma";
import {
  etl_cloudfunc_log_sync,
  etl_cloudfunc_log_error,
} from "@prisma/client";
import { timeZone } from "@/config/constants";
import { CloudFunctionScheduler } from "@/enums/cloud-functions";

export const getSyncCountSummary = async (day: string) => {
  try {
    const results = await prisma.$queryRaw<etl_cloudfunc_log_sync[]>`
      SELECT cloud_function, CAST(COUNT(*) AS VARCHAR) as cloudfunc_log_sync_id
      FROM (
        SELECT DISTINCT cloud_function, cf_execution_id
        FROM etl_cloudfunc_log_sync
        WHERE 
          cf_scheduler = ${CloudFunctionScheduler.Delta}::cf_scheduler
          AND DATE_TRUNC('day', last_cf_execution AT TIME ZONE ${timeZone}) = DATE_TRUNC('day', ${day}::date)
      ) AS unique_combinations
      GROUP BY cloud_function;
    `;
    return results;
  } catch (error) {
    console.error("getSyncCountSummary Error", error);
    return [];
  }
};

export const getErrorCountSummary = async (day: string) => {
  try {
    const results = await prisma.$queryRaw<etl_cloudfunc_log_error[]>`
      SELECT cloud_function, CAST(COUNT(*) AS VARCHAR) as cloudfunc_log_error_id
      FROM etl_cloudfunc_log_error
      WHERE DATE_TRUNC('day', created_at - INTERVAL '4 hours') = DATE_TRUNC('day', ${day}::date)
      GROUP BY cloud_function;
    `;
    return results;
  } catch (error) {
    console.error("getSyncCountSummary Error", error);
    return [];
  }
};

export const getSemaphoreProcessingDate = async () => {
  try {
    const results = await prisma.$queryRaw<etl_cloudfunc_log_sync[]>`
      SELECT 
        cloudfunc_log_sync_id,
        cloud_function,
        bigquery_entity,
        postgres_table,
        process_date,
        TO_CHAR(process_date, 'YYYY-MM-DD HH24:MI:SS.US') AS process_date_str
      FROM (
        SELECT *,
          ROW_NUMBER() OVER (PARTITION BY cloud_function, bigquery_entity, postgres_table ORDER BY created_at DESC) as rn
        FROM etl_cloudfunc_log_sync
        WHERE cf_scheduler = ${CloudFunctionScheduler.Delta}::cf_scheduler
      ) subquery
      WHERE rn = 1
      ORDER BY cloud_function ASC, created_at ASC;
    `;
    return results;
  } catch (error) {
    console.error("getSemaphoreProcessingDate Error", error);
    return [];
  }
};
