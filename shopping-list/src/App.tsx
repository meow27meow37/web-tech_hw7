import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Ad = {
  id: number
  title: string
  description: string
  price: number
  image_url: string | null
}

const apiUrl = 'https://inai-col1.fishrungames.com/ads'

async function getAds() {
  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw new Error('Не удалось загрузить объявления.')
  }

  const data: { items: Ad[] } = await response.json()
  return data.items
}

function App() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [posting, setPosting] = useState(false)
  const [message, setMessage] = useState('')

  async function loadAds() {
    setError('')

    try {
      setAds(await getAds())
    } catch {
      setError('Не удалось загрузить объявления. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAds()
      .then(setAds)
      .catch(() => setError('Не удалось загрузить объявления. Попробуйте ещё раз.'))
      .finally(() => setLoading(false))
  }, [])

  async function addAd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPosting(true)
    setMessage('')
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const image = formData.get('image')
    if (image instanceof File && image.size === 0) {
      formData.delete('image')
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Не удалось отправить объявление.')
      }

      const newAd: Ad = await response.json()
      setAds((currentAds) => [newAd, ...currentAds])
      form.reset()
      setMessage('Объявление опубликовано.')
    } catch {
      setError('Не удалось отправить объявление. Попробуйте ещё раз.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <main className="container">
      <h1>Доска объявлений</h1>

      <section>
        <h2>Добавить объявление</h2>
        <form onSubmit={addAd}>
          <label>
            Название
            <input name="title" type="text" required />
          </label>

          <label>
            Описание
            <textarea name="description" required rows={3} />
          </label>

          <label>
            Цена
            <input name="price" type="number" min="0" step="0.01" required />
          </label>

          <label>
            Фотография
            <input name="image" type="file" accept="image/*" />
          </label>

          <button className="publish-button" type="submit" disabled={posting}>
            {posting ? 'Отправка...' : 'Опубликовать'}
          </button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section>
        <h2>Объявления</h2>
        {loading && <p>Загрузка...</p>}
        {!loading && error && (
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              void loadAds()
            }}
          >
            Загрузить ещё раз
          </button>
        )}
        {!loading && !error && ads.length === 0 && <p>Объявлений пока нет.</p>}
        <ul className="ads-list">
          {ads.map((ad) => (
            <li className="ad" key={ad.id}>
              {ad.image_url && (
                <img
                  src={`https://inai-col1.fishrungames.com${ad.image_url}`}
                  alt={ad.title}
                />
              )}
              <h3>{ad.title}</h3>
              <p>{ad.description}</p>
              <p><strong>{ad.price} ₽</strong></p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
