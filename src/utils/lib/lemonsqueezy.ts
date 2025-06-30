/**
 * Lemon Squeezy에서 체크아웃 URL을 생성합니다.
 */
export async function createLemonSqueezyCheckoutUrl(
  variantId: number,
  userId: string,
  userEmail: string | null,
): Promise<string | null> {
  try {
    // 1. 환경변수 검증
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!apiKey || !storeId || !appUrl) {
      console.error("Missing Lemon Squeezy environment variables:", {
        hasApiKey: !!apiKey,
        hasStoreId: !!storeId,
        hasAppUrl: !!appUrl,
      });
      return null;
    }

    console.log("Creating checkout with:", {
      variantId,
      userId,
      userEmail,
      storeId: storeId,
    });

    // 2. 올바른 API 요청 페이로드 (Lemon Squeezy 공식 문서 기준)
    const payload = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: userEmail || "",
            custom: {
              user_id: userId,
            },
          },
          product_options: {
            redirect_url: `${appUrl}/payment/success`, // success URL
          },
          checkout_options: {
            button_color: "#7C3AED", // 선택사항
          },
          expires_at: null, // 만료 없음
          preview: false, // 실제 체크아웃 생성
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: storeId,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId.toString(),
            },
          },
        },
      },
    };

    console.log("Lemon Squeezy API payload:", JSON.stringify(payload, null, 2));

    // 3. API 호출
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    // 4. 응답 처리
    const responseText = await response.text();
    console.log("Lemon Squeezy API response status:", response.status);
    console.log(
      "Lemon Squeezy API response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    if (!response.ok) {
      console.error("Lemon Squeezy API Error Response:", responseText);

      try {
        const errorData = JSON.parse(responseText);
        console.error("Parsed error data:", errorData);

        // API 에러 메시지 자세히 출력
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach((error: any, index: number) => {
            console.error(`Error ${index + 1}:`, {
              status: error.status,
              title: error.title,
              detail: error.detail,
              source: error.source,
            });
          });
        }
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
      }

      return null;
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse success response:", parseError);
      return null;
    }

    console.log("Lemon Squeezy API success response:", data);

    const checkoutUrl = data.data?.attributes?.url;

    if (!checkoutUrl) {
      console.error("No checkout URL in response. Full response:", data);
      return null;
    }

    console.log("Successfully created checkout URL:", checkoutUrl);
    return checkoutUrl;
  } catch (error) {
    console.error("Error creating Lemon Squeezy checkout URL:", error);
    return null;
  }
}
