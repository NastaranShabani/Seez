export const differenceTime = (bookingDate:Date) => {
const currentTime: Date = new Date();
let timeDifference:number = bookingDate.getTime() >= currentTime.getTime() ? bookingDate.getTime() - currentTime.getTime() : currentTime.getTime() - bookingDate.getTime();
const hoursDifference = timeDifference / (1000 * 60 * 60);
if (hoursDifference <= 24) {
   return true
}  
return false
}