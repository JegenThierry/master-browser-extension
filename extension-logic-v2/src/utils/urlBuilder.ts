class UrlBuilder {
  private url = "";
  private encodedParams: string[] = [];
  private urlExtensions: string[] = [];

  constructor(baseUrl: string) {
    this.url = baseUrl;
  }

  public addParameter(paramName: string, paramValue: any): UrlBuilder {
    return this;
  }

  public addUrlExtension(extensionName: string): UrlBuilder {
    return this;
  }

  public build() {}
}
