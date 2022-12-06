const ID = element => {
  return document.getElementById(element)
}

let segundos = 0
let contadorSegundos
let linhas = []

if (!$('#tabela tr')[1]) $('#secaoTabela').hide()

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
    $('#relogio').text(fnVisor(segundos))
  }, 1000)
}

const fnInicia = () => {
  if (!$('#visorUsuario').val() || !$('#visorAtividade').val()) {
    alert('é necessário preencher o usuário e a atividade.')
  } else {
    clearInterval(contadorSegundos)
    fnContador()
    $('.cadastros input').prop('disabled', true)
    $('#botaoIniciar').prop('disabled', true)
  }
}

const inputer = () => {
  return {
    nome: $('#visorUsuario').val().toUpperCase().trim(),
    atividade: $('#visorAtividade').val().toUpperCase().trim(),
    tipoAtividade: $('#visorTipoAtividade').val().toUpperCase().trim(),
    tempo: $('#relogio').text(),
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
  $('#relogio').text('00:00:00')
  $('.cadastros input').prop('disabled', false)
}

const fnFinaliza = () => {
  const filtroNome = $('#visorUsuario').val().toUpperCase().trim()
  const filtroAtividade = $('#visorAtividade').val().toUpperCase().trim()
  const filtroTipoAtividade = $('#visorTipoAtividade')
    .val()
    .toUpperCase()
    .trim()
  let linhasRepetidas = 1
  clearInterval(contadorSegundos)
  segundos = 0
  $('#botaoIniciar').prop('disabled', false)
  if (!$('#visorUsuario').val() || !$('#visorAtividade').val()) {
    alert('é necessário preencher o usuário e a atividade.')
    return
  } else {
    if (!$('#tabela tr')[1]) {
      fnInsereLinha()
    } else {
      $('#tabela tr').each((i, e) => {
        const filtrado = $(e).find('td').text().toUpperCase().trim()
        if (i != 0) {
          if (
            filtrado[0] != filtroNome ||
            filtrado[1] != filtroAtividade ||
            filtrado[2] != filtroTipoAtividade
          ) {
            linhasRepetidas++
          } else {
            let tempoTd = $(e).find('td:nth-child(4)').text().split(':')
            let tempoCronometro = $('#relogio').text().split(':')
            $(e)
              .find('td:nth-child(4)')
              .text(
                fnVisor(
                  Number(tempoTd[0] * 360) +
                    Number(tempoTd[1] * 60) +
                    Number(tempoTd[2]) +
                    Number(tempoCronometro[0] * 360) +
                    Number(tempoCronometro[1] * 60) +
                    Number(tempoCronometro[2])
                )
              )
            $('#relogio').text('00:00:00')
            $('.cadastros input').prop('disabled', false)
          }
        }
      })
      if (linhasRepetidas > 1 && $('#tabela tr').length == linhasRepetidas) {
        fnInsereLinha()
      }
    }
  }
  $('.cadastros input').val('')
}

function fnAddLinha() {
  let i = linhas.length - 1

  $('#tabelaCorpo').append(
    $('<tr>')
      .append($('<td>').append(linhas[i].nome))
      .append($('<td>').append(linhas[i].atividade))
      .append($('<td>').append(linhas[i].tipoAtividade))
      .append($('<td>').append(linhas[i].tempo))
      .append(
        $('<td>')
          .append(linhas[i].editar)
          .addClass('icone-editar')
          .attr('onclick', 'fnEditarLinha(this)')
      )
      .append(
        $('<td>')
          .append(linhas[i].deletar)
          .addClass('icone-lixeira')
          .attr('onClick', 'fnDeletarLinha(this)')
      )
  )

  $('#secaoTabela').show()
}

const fnOrdenaTabela = coluna => {
  var trocando, direcao, i, deveTrocar, tupla1, tupla2
  let trocador = 0
  trocando = true
  direcao = 'asc'
  while (trocando) {
    trocando = false
    for (i = 1; i < $('#tabela tr').length - 1; i++) {
      deveTrocar = false

      tupla1 = $(`#tabela tr:nth-child(${i}) td:nth-child(${coluna})`)
      tupla2 = $(`#tabela tr:nth-child(${i + 1}) td:nth-child(${coluna})`)

      if (direcao == 'asc') {
        if (tupla1.text() > tupla2.text()) {
          deveTrocar = true
          break
        }
      } else if (direcao == 'desc') {
        if (tupla1.text() < tupla2.text()) {
          deveTrocar = true
          break
        }
      }
    }
    if (deveTrocar) {
      $(tupla2).parent().insertBefore($(tupla1).parent())
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

const fnProcurar = () => {
  const filtro = $('#visorProcurar').val().toUpperCase().trim()
  var td, i, colN

  for (i = 0; i < $('#tabela tr').length; i++) {
    if ($('#visorFiltrar').val() == 'usuario') colN = 0
    if ($('#visorFiltrar').val() == 'atividade') colN = 1
    if ($('#visorFiltrar').val() == 'tipoAtividade') colN = 2
    td = $('#tabela tr')[i].getElementsByTagName('td')[colN]
    if (td) {
      if (td.innerHTML.toUpperCase().trim() == filtro) {
        $('#tabela tr')[i].show()
      } else {
        $('#tabela tr')[i].hide()
      }
    }
  }
}

const fnLimparFiltro = () => {
  var td, i

  for (i = 0; i < tr.length; i++) {
    td = $('#tabela tr')[i].getElementsByTagName('td')[1]
    if (td) {
      $('#tabela tr')[i].show()
    }
  }
  $('#visorProcurar').val('')
}

const fnDeletarLinha = estaLinha => {
  tabela.deleteRow(estaLinha.parentNode.rowIndex)
  if (!$('#tabela tr')[1]) secaoTabela.style.display = 'none'
}

const fnEditarLinha = estaLinha => {
  const col =
    $('#tabela tr')[estaLinha.parentNode.rowIndex].getElementsByTagName('td')
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

$('#botaoIniciar').on('click', fnInicia)

$('#botaoFinalizar').on('click', fnFinaliza)

$('.cadastros input').on('keyup', e => {
  if (e.keyCode === 13) fnInicia()
})

$('#visorProcurar').on('keyup', e => {
  if (e.keyCode === 13) fnProcurar()
})

$('#botaoPausar').on('click', e => {
  if (!$('#visorUsuario').val() || !$('#visorAtividade').val()) {
    alert('é necessário preencher o usuário e a atividade.')
  } else {
    if ($('#botaoPausar').hasClass('pausado')) {
      $('#botaoPausar').removeClass('pausado')
      clearInterval(contadorSegundos)
      fnContador()
      $('#botaoPausar').prev().text('pausar')
    } else {
      clearInterval(contadorSegundos)
      $('#botaoPausar').addClass('pausado')
      $('#botaoPausar').prev().text('retomar')
    }
  }
})
