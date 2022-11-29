const ID = element => {
  return document.getElementById(element)
}

let segundos = 0
let contadorSegundos
let linhas = []

const tr = ID('tabela').getElementsByTagName('tr')
const tuplas = ID('tabela').rows

if (!tuplas[1]) ID('secaoTabela').style.display = 'none'

const fnVisor = segundos => {
  const tempo = new Date(segundos * 1000)
  return tempo.toLocaleTimeString('pt-BR', {
    hour12: false,
    timeZone: 'UTC'
  })
}

const fnContador = () => {
  contadorSegundos = setInterval(() => {
    segundos++
    ID('relogio').innerHTML = fnVisor(segundos)
  }, 1000)
}

const fnInicia = () => {
  if (!ID('visorUsuario').value || !ID('visorAtividade').value) {
    alert('é necessário preencher o usuário e a atividade.')
  } else {
    clearInterval(contadorSegundos)
    fnContador()
    ID('visorUsuario').setAttribute('disabled', '')
    ID('visorAtividade').setAttribute('disabled', '')
    ID('visorTipoAtividade').setAttribute('disabled', '')
    ID('botaoIniciar').setAttribute('disabled', '')
  }
}

ID('botaoIniciar').addEventListener('click', e => {
  fnInicia()
})

document.addEventListener('keyup', e => {
  if (e.keyCode === 13) {
    if (
      e.target.id === ID('visorUsuario').id ||
      e.target.id === ID('visorAtividade').id ||
      e.target.id === ID('visorTipoAtividade').id
    ) {
      fnInicia()
    }
  }
})

ID('botaoPausar').addEventListener('click', e => {
  if (!ID('visorUsuario').value || !ID('visorAtividade').value) {
    alert('é necessário preencher o usuário e a atividade.')
  } else {
    if (ID('botaoPausar').classList.contains('pausado')) {
      ID('botaoPausar').classList.remove('pausado')
      clearInterval(contadorSegundos)
      fnContador()
      ID('botaoPausar').parentElement.firstElementChild.innerText = 'pausar'
    } else {
      clearInterval(contadorSegundos)
      ID('botaoPausar').classList.add('pausado')
      ID('botaoPausar').parentElement.firstElementChild.innerText = 'retomar'
    }
  }
})

const inputer = () => {
  return {
    nome: ID('visorUsuario').value.toUpperCase().trim(),
    atividade: ID('visorAtividade').value.toUpperCase().trim(),
    tipoAtividade: ID('visorTipoAtividade').value.toUpperCase().trim(),
    tempo: ID('relogio').innerText,
    editar: '',
    deletar: ''
  }
}

class Linha {
  constructor(nome, atividade, tipoAtividade, tempo, editar, deletar) {
    this.nome = nome
    this.atividade = atividade
    this.tipoAtividade = tipoAtividade
    this.tempo = tempo
    this.editar = editar
    this.deletar = deletar
  }
}

const fnLinhas = (nome, atividade, tipoAtividade, tempo, editar, deletar) => {
  linhas.push(new Linha(nome, atividade, tipoAtividade, tempo, editar, deletar))
}

const fnInsereLinha = () => {
  fnLinhas(
    inputer().nome,
    inputer().atividade,
    inputer().tipoAtividade,
    inputer().tempo,
    inputer().editar,
    inputer().deletar
  )
  fnAddLinha()
  ID('relogio').innerText = '00:00:00'
  ID('visorUsuario').removeAttribute('disabled', '')
  ID('visorAtividade').removeAttribute('disabled', '')
  ID('visorTipoAtividade').removeAttribute('disabled', '')
}

const fnFinaliza = () => {
  clearInterval(contadorSegundos)
  segundos = 0
  ID('botaoIniciar').removeAttribute('disabled', '')
  let linhasRepetidas = 1
  if (!ID('visorUsuario').value || !ID('visorAtividade').value) {
    alert('é necessário preencher o usuário e a atividade.')
    return
  } else {
    if (!tr[1]) {
      fnInsereLinha()
    } else {
      const filtroNome = ID('visorUsuario').value.toUpperCase().trim()
      const filtroAtividade = ID('visorAtividade').value.toUpperCase().trim()
      const filtroTipoAtividade = ID('visorTipoAtividade')
        .value.toUpperCase()
        .trim()
      for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')
        if (
          td[0].innerHTML.toUpperCase().trim() != filtroNome ||
          td[1].innerHTML.toUpperCase().trim() != filtroAtividade ||
          td[2].innerHTML.toUpperCase().trim() != filtroTipoAtividade
        ) {
          linhasRepetidas++
        } else {
          let tempoTd = td[3].innerHTML.split(':')
          let tempoCronometro = ID('relogio').innerHTML.split(':')
          td[3].innerHTML = fnVisor(
            Number(tempoTd[0] * 360) +
              Number(tempoTd[1] * 60) +
              Number(tempoTd[2]) +
              Number(tempoCronometro[0] * 360) +
              Number(tempoCronometro[1] * 60) +
              Number(tempoCronometro[2])
          )
          ID('relogio').innerHTML = '00:00:00'
          ID('visorUsuario').removeAttribute('disabled', '')
          ID('visorAtividade').removeAttribute('disabled', '')
          ID('visorTipoAtividade').removeAttribute('disabled', '')
        }
      }
      if (linhasRepetidas > 1 && tr.length == linhasRepetidas) fnInsereLinha()
    }
  }
  ID('visorUsuario').value = ''
  ID('visorAtividade').value = ''
  ID('visorTipoAtividade').value = ''
}

ID('botaoFinalizar').addEventListener('click', e => {
  fnFinaliza()
})

function fnAddLinha() {
  const tr = ID('tabelaCorpo').insertRow(-1)

  ID('secaoTabela').style.display = ''

  let i = linhas.length - 1

  const tdNome = document.createTextNode(linhas[i].nome)
  const tdAtividade = document.createTextNode(linhas[i].atividade)
  const tdTipoAtividade = document.createTextNode(linhas[i].tipoAtividade)
  const tdTempo = document.createTextNode(linhas[i].tempo)
  const tdEditar = document.createTextNode(linhas[i].editar)
  const tdDeletar = document.createTextNode(linhas[i].deletar)

  tr.insertCell(0).appendChild(tdNome)
  tr.insertCell(1).appendChild(tdAtividade)
  tr.insertCell(2).appendChild(tdTipoAtividade)
  tr.insertCell(3).appendChild(tdTempo)
  let tdBotaoEditar = tr.insertCell(4)
  let tdBotaoDeletar = tr.insertCell(5)
  tdBotaoEditar.appendChild(tdEditar)
  tdBotaoEditar.setAttribute('onclick', 'fnEditarLinha(this)')
  tdBotaoEditar.setAttribute('class', 'icone-editar')
  tdBotaoDeletar.appendChild(tdDeletar)
  tdBotaoDeletar.setAttribute('onclick', 'fnDeletarLinha(this)')
  tdBotaoDeletar.setAttribute('class', 'icone-lixeira')
}

const fnOrdenaTabela = coluna => {
  var trocando, direcao, i, deveTrocar, tupla1, tupla2
  let trocador = 0
  trocando = true
  direcao = 'asc'
  while (trocando) {
    trocando = false
    for (i = 1; i < tuplas.length - 1; i++) {
      deveTrocar = false

      tupla1 = tuplas[i].getElementsByTagName('td')[coluna]
      tupla2 = tuplas[i + 1].getElementsByTagName('td')[coluna]

      if (direcao == 'asc') {
        if (tupla1.innerHTML > tupla2.innerHTML) {
          deveTrocar = true
          break
        }
      } else if (direcao == 'desc') {
        if (tupla1.innerHTML < tupla2.innerHTML) {
          deveTrocar = true
          break
        }
      }
    }
    if (deveTrocar) {
      tuplas[i].parentNode.insertBefore(tuplas[i + 1], tuplas[i])
      trocando = true
      trocador++
    } else {
      if (trocador == 0 && direcao == 'asc') {
        direcao = 'desc'
        trocando = true
      }
    }
  }
}

ID('visorProcurar').addEventListener('keyup', e => {
  if (e.keyCode === 13) {
    fnProcurar()
  }
})

const fnProcurar = () => {
  const filtro = ID('visorProcurar').value.toUpperCase().trim()
  var td, i, colN

  for (i = 0; i < tr.length; i++) {
    if (ID('visorFiltrar').value == 'usuario') colN = 0
    if (ID('visorFiltrar').value == 'atividade') colN = 1
    if (ID('visorFiltrar').value == 'tipoAtividade') colN = 2
    td = tr[i].getElementsByTagName('td')[colN]
    if (td) {
      if (td.innerHTML.toUpperCase().trim() == filtro) {
        tr[i].style.display = ''
      } else {
        tr[i].style.display = 'none'
      }
    }
  }
}

const fnLimparFiltro = () => {
  var td, i

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[1]
    if (td) {
      tr[i].style.display = ''
    }
  }
  ID('visorProcurar').value = ''
}

const fnDeletarLinha = estaLinha => {
  tabela.deleteRow(estaLinha.parentNode.rowIndex)
  if (!tuplas[1]) secaoTabela.style.display = 'none'
}

const fnEditarLinha = estaLinha => {
  const col = tuplas[estaLinha.parentNode.rowIndex].getElementsByTagName('td')
  const novoID = estaLinha.parentNode.rowIndex

  let temp = col[0].innerText
  let temp1 = col[1].innerText
  let temp2 = col[2].innerText

  col[0].innerHTML = `<input
  id="editarUsuario${novoID}"
  type="text"
  name="usuarioEditado"
  placeholder="${col[0].innerText}"
/>`

  col[1].innerHTML = `<input
  id="editarAtividade${novoID}"
  type="text"
  name="AtividadeEditado"
  placeholder="${col[1].innerText}"
/>`

  col[2].innerHTML = `<input
  id="editarTipoAtividade${novoID}"
  type="text"
  name="tipoAtividadeEditado"
  placeholder="${col[2].innerText}"
/>`

  document.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      if (!document.getElementById('editarUsuario' + novoID).value) {
        col[0].innerText = temp
      } else {
        col[0].innerText = document
          .getElementById('editarUsuario' + novoID)
          .value.toUpperCase()
      }
      if (!document.getElementById('editarAtividade' + novoID).value) {
        col[1].innerText = temp1
      } else {
        col[1].innerText = document
          .getElementById('editarAtividade' + novoID)
          .value.toUpperCase()
      }
      if (!document.getElementById('editarTipoAtividade' + novoID).value) {
        col[2].innerText = temp2
      } else {
        col[2].innerText = document
          .getElementById('editarTipoAtividade' + novoID)
          .value.toUpperCase()
      }
      temp = col[0].innerText
      temp1 = col[1].innerText
      temp2 = col[2].innerText
    }
  })
}
