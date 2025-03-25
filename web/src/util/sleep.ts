export async function sleep(timeInMiliSeconds?: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, timeInMiliSeconds || 700)
  })
}
