import { useState, useEffect } from 'react'
import { FontSelector } from './modules/ui-components/FontSelector'
import { ParameterControls } from './modules/ui-components/ParameterControls'
import { Preview3D } from './modules/ui-components/Preview3D'
import { RobustnessIndicator } from './modules/ui-components/RobustnessIndicator'
import { ExportButton } from './modules/ui-components/ExportButton'
import { generateGeometry } from './modules/letter-engine/generateGeometry'
import type { LetterGeometryParams, GeometryResult } from './modules/letter-engine/types'

export function App() {
  const [letter, setLetter] = useState('A')
  const [fontId, setFontId] = useState('roboto')

  const [params, setParams] = useState<Partial<LetterGeometryParams>>({
    capWidthMm: 35,
    topThickness: 1.5,
    imageDepth: 0.8,
    tolerance: 0.4,
    stemTolerance: 0,
  })

  const [geometry, setGeometry] = useState<GeometryResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const generate = async () => {
      setLoading(true)
      try {
        const result = await generateGeometry({
          letter,
          fontId,
          capWidthMm: params.capWidthMm || 35,
          topThickness: params.topThickness || 1.5,
          imageDepth: params.imageDepth || 0.8,
          tolerance: params.tolerance || 0.4,
          stemTolerance: params.stemTolerance || 0,
        })
        setGeometry(result)
      } catch (_error) {
        console.error('Error generando geometría')
      } finally {
        setLoading(false)
      }
    }
    generate()
  }, [letter, fontId, params])

  const handleParamChange = (key: keyof LetterGeometryParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="app-pro">
      <header className="header-pro">
        <div className="header-left">
          <h1>SHAMMAH Clicker Studio</h1>
          <p>Genera modelos 3D listos para tu Bambu Lab P2S</p>
        </div>
        <div className="header-actions">
          <a href="https://arugerio.github.io/Shammah3d/" className="btn-secondary">← Volver</a>
          <a href="https://api.whatsapp.com/send?phone=5215559650025" target="_blank" rel="noopener" className="btn-secondary">📞 Soporte</a>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar-left">
          <div className="panel-header">📋 SHAMMAH Clicker Studio</div>
          <p className="sidebar-desc">Plataforma operada por SHAMMAH CREA 3D</p>

          <div className="section">
            <h3 className="section-title">LETRA</h3>
            <div className="control-group">
              <input
                type="text"
                value={letter}
                onChange={(e) => setLetter(e.target.value.toUpperCase().slice(0, 1) || 'A')}
                maxLength={1}
                className="input-letter"
              />
            </div>
            <FontSelector value={fontId} onChange={setFontId} />
          </div>

          <div className="section">
            <h3 className="section-title">PARÁMETROS</h3>
            <ParameterControls params={params} onChange={handleParamChange} />
          </div>
        </aside>

        <main className="viewport-center">
          {loading ? (
            <div className="loading">⚙️ Generando...</div>
          ) : geometry ? (
            <Preview3D geometry={geometry.geometry} />
          ) : (
            <div className="loading">Error</div>
          )}
        </main>

        <aside className="sidebar-right">
          <div className="panel-header">📥 EXPORTAR</div>

          {geometry && (
            <div className="section">
              <h3 className="section-title">VALIDACIÓN FDM</h3>
              <RobustnessIndicator score={geometry.robustness} />
            </div>
          )}

          {geometry && !loading && (
            <ExportButton geometry={geometry.geometry} letter={letter} />
          )}
        </aside>
      </div>
    </div>
  )
}
