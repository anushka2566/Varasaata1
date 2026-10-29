import { describe, expect, it } from "vitest";
import { AD_IDS, canShowInterstitial } from "./ads";

describe("ads", () => {
  it("uses Google test ad units by default", () => {
    expect(AD_IDS.banner).toBe("ca-app-pub-3940256099942544/6300978111");
    expect(AD_IDS.interstitial).toBe("ca-app-pub-3940256099942544/1033173712");
  });
  it("blocks a second interstitial within 3 minutes", () => {
    expect(canShowInterstitial(1000 + 179_000, 1000)).toBe(false);
  });
  it("allows an interstitial after 3 minutes", () => {
    expect(canShowInterstitial(1000 + 180_000, 1000)).toBe(true);
    expect(canShowInterstitial(5, null)).toBe(true);
  });
});
