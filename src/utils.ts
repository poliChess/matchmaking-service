type Status = { success: boolean, message: string }
const statusGood = { success: true, message: "ok" }
const statusBad = (msg: String) => ({ success: false, message: msg })

export { Status, statusBad, statusGood }
