"use server";

import prisma from "@/lib/prisma";
import { etl_cloudfunc_log_sync } from "@prisma/client";
import { timeZone } from "@/config/constants";
import { CloudFunctionScheduler } from "@/enums/cloud-functions";

export const getSyncHistoryView = async (
  cloudFunction: string,
  view: string,
  day: string
) => {
  try {
    const results = await prisma.$queryRaw<etl_cloudfunc_log_sync[]>`
      SELECT cf_execution_id, MIN(last_cf_execution) AS last_cf_execution
      FROM etl_cloudfunc_log_sync
      WHERE
        cloud_function = ${cloudFunction}::cf_name
        AND cf_scheduler = ${CloudFunctionScheduler.Delta}::cf_scheduler
        AND DATE_TRUNC(${view}, last_cf_execution AT TIME ZONE ${timeZone}) = DATE_TRUNC(${view}, ${day}::date)
      GROUP BY cf_execution_id
      ORDER BY last_cf_execution ASC;
    `;
    return results;
  } catch (error) {
    console.error("getSyncHistoryView Error", error);
    return [];
  }
};

export const getSyncHistoryDetail = async (cf_execution_id: string) => {
  try {
    const results = await prisma.$queryRaw<etl_cloudfunc_log_sync[]>`
      SELECT
        cloudfunc_log_sync_id,
        TO_CHAR(cf_partial_execution_time, '0.00') AS cf_partial_execution_time,
        bigquery_entity, 
        bigquery_query, 
        TO_CHAR(bigquery_rows, 'FM9999999999999999') AS bigquery_rows, 
        filtered_entities, 
        TO_CHAR(filtered_rows, 'FM9999999999999999') AS filtered_rows,
        TO_CHAR(no_repeat_rows, 'FM9999999999999999') AS no_repeat_rows,
        postgres_table,
        TO_CHAR(inserted_rows, 'FM9999999999999999') AS inserted_rows,
        TO_CHAR(updated_rows, 'FM9999999999999999') AS updated_rows,
        TO_CHAR(cf_total_execution_time, '0.00') AS cf_total_execution_time,
        process_date,
        TO_CHAR(process_date, 'YYYY-MM-DD HH24:MI:SS.US') AS process_date_str
      FROM etl_cloudfunc_log_sync
      WHERE cf_execution_id = ${cf_execution_id}
      ORDER BY last_cf_execution ASC;
    `;
    return results;
  } catch (error) {
    console.error("getSyncHistoryDetail Error", error);
    return [];
  }
};
