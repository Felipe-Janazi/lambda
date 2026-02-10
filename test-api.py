import os
from groq import Groq
from groq.errors import AuthenticationError, RateLimitError

def test_groq_token():
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        print("❌ GROQ_API_KEY não está definida no ambiente.")
        return

    try:
        client = Groq(api_key=api_key)

        # Chamada mínima só para validar o token
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "user", "content": "ping"}
            ],
            max_tokens=5
        )

        print("✅ Token GROQ válido!")
        print("Resposta da API:", response.choices[0].message.content)

    except AuthenticationError:
        print("❌ Token GROQ inválido ou expirado.")

    except RateLimitError:
        print("⚠️ Token válido, mas limite de uso foi atingido.")

    except Exception as e:
        print("❌ Erro inesperado ao testar a API:")
        print(e)


if __name__ == "__main__":
    test_groq_token()
