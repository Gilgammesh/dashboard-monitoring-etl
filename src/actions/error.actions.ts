"use server";

import prisma from "@/lib/prisma";
import { etl_cloudfunc_log_error } from "@prisma/client";

export const getErrorHistoryView = async (
  cloudFunction: string,
  view: string,
  day: string
) => {
  try {
    const results = await prisma.$queryRaw<etl_cloudfunc_log_error[]>`
      WITH PreData AS (
        SELECT 
		      TO_CHAR(created_at - INTERVAL '4 hours', 'YYYY-MM-DD') AS cloudfunc_log_error_id, 
		      created_at
        FROM etl_cloudfunc_log_error
        WHERE
          cloud_function = ${cloudFunction}::cf_name
          AND DATE_TRUNC(${view}, created_at - INTERVAL '4 hours') = DATE_TRUNC(${view}, ${day}::date)
      )
      SELECT cloudfunc_log_error_id, MIN(created_at) AS created_at
      FROM PreData
      GROUP BY cloudfunc_log_error_id;      
    `;
    return results;
  } catch (error) {
    console.error("getErrorHistoryView Error", error);
    return [];
  }
};

export const getErrorHistoryDetail = async (
  cloudFunction: string,
  day: string
) => {
  try {
    const results = await prisma.$queryRaw<etl_cloudfunc_log_error[]>`
      SELECT
        cloudfunc_log_error_id,
        status,
		    error,
        created_at,
		    updated_at
      FROM etl_cloudfunc_log_error
      WHERE
        cloud_function = ${cloudFunction}::cf_name
        AND DATE_TRUNC('day', created_at - INTERVAL '4 hours') = DATE_TRUNC('day', ${day}::date)
      ORDER BY created_at ASC;
    `;
    return results;
  } catch (error) {
    console.error("getErrorHistoryDetail Error", error);
    return [];
  }
};
