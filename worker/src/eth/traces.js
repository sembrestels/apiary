import { call } from 'cofx'
import { sql } from 'sqliterally'

export async function fetchTracesFromEthEvents (ctx, blockNumber) {
  const q = sql`
    select timestamp, transaction_hash, traces
    from trace
    where block_number = ${blockNumber}
  `

  const { rows } = await ctx.ethstore.query({
    name: 'get-traces',
    text: q.text,
    values: q.values
  })

  const traces = rows.map((row) => {
    const actions = row.traces.map((action) => ({
      to: action.action_to,
      from: action.action_from,
      input: action.action_input
    }))

    return {
      transactionHash: row.transaction_hash,
      timestamp: row.timestamp,
      actions
    }
  })

  return traces
}

export function fetchTraces (
  ctx,
  blockNumber
) {
  return call(fetchTracesFromEthEvents, ctx, blockNumber)
}

export function * processTraces (
  ctx,
  traces,
  fn
) {
  for (const trace of traces) {
    yield call(fn, ctx, trace)
  }
}