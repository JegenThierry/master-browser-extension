class FormatHelper {
  public formatDate(date: Date): string {
    if (!(date instanceof Date)) return '';

    const day = this.addLeadingZero(date.getDate());
    const month = this.addLeadingZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = this.addLeadingZero(date.getHours());
    const minutes = this.addLeadingZero(date.getMinutes());
    const seconds = this.addLeadingZero(date.getSeconds());

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

  public formatTimeFromSeconds(value: number) {
    console.log(value);
    const seconds = this.addLeadingZero(Math.floor(value % 60));
    const minutes = this.addLeadingZero(Math.floor(value / 60));

    return `${minutes}:${seconds}`;
  }

  private addLeadingZero(value: number): string {
    value = parseInt(value.toString());
    return value < 10 ? `0${value}` : `${value}`;
  }
}

export default new FormatHelper();
