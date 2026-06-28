import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export const ok = <T>(data: T, status = 200) => NextResponse.json({ ok: true, data }, { status })
export const err = (code: string, msg: string, status = 400) => NextResponse.json({ ok: false, error: { code, msg } }, { status })
export const unauth = () => err('UNAUTH', 'Not signed in', 401)
export const forbidden = () => err('FORBIDDEN', 'Access denied', 403)
export const notFound = () => err('NOT_FOUND', 'Not found', 404)
export const serverErr = () => err('SERVER_ERROR', 'Something went wrong', 500)
export const zodErr = (e: ZodError) => err('VALIDATION', e.issues[0]?.message ?? 'Invalid input', 422)
