import query from '../../services/graphql'

export default async (req, res) => {
  const { jurors } = await query(`{
    jurors {
      id,
      activeBalance
    }
  }`)

  res.json({ jurors })
}