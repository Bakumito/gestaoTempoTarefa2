let segundos = 0
let contadorSegundos
let linhas = []
const botaoPausar = $('#botaoPausar')

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

const fnInsereLinha = () => {
  const inputers = inputer()
  linhas.push(
    new Linha(
      inputers.nome,
      inputers.atividade,
      inputers.tipoAtividade,
      inputers.tempo,
      inputers.editar,
      inputers.deletar
    )
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
  let filtrado, colN
  let visorFiltrar = $('#visorFiltrar').val()

  $('#tabela tr').each((i, e) => {
    if (visorFiltrar == 'usuario') colN = 1
    if (visorFiltrar == 'atividade') colN = 2
    if (visorFiltrar == 'tipoAtividade') colN = 3

    filtrado = $(`#tabela tr:nth-child(${i}) td:nth-child(${colN})`)

    if (filtrado) {
      if (filtrado.text().toUpperCase().trim() == filtro) {
        $(e).show()
      } else {
        $(e).hide()
      }
    }
  })
}

const fnLimparFiltro = () => {
  $('#tabela tr').each((i, e) => {
    let verificaFiltrado = $(`#tabela tr:nth-child(${i}) td`)
    if (verificaFiltrado) {
      $(e).show()
    }
  })

  $('#visorProcurar').val('')
}

const fnDeletarLinha = estaLinha => {
  $(estaLinha).parent().remove()
  if (!$('#tabela tr')[1]) $('#secaoTabela').hide()
}

const fnEditarLinha = estaLinha => {
  const novoID = $(estaLinha).parent().index() + 1

  const fnAchaColuna = (estaLinha, coluna) => {
    return $(estaLinha).parent().find(`td:nth-child(${coluna})`)
  }

  const criaInput = (estaLinha, coluna) => {
    return `<input
      id="editar${coluna}${novoID}"
      class="inputEditar"
      type="text"
      name="usuarioEditado"
      placeholder="${fnAchaColuna(estaLinha, coluna).text()}"
    />`
  }

  let textoUsuario = fnAchaColuna(estaLinha, 1).text()
  let textoAtividade = fnAchaColuna(estaLinha, 2).text()
  let textoTipoAtividade = fnAchaColuna(estaLinha, 3).text()

  for (let i = 1; i <= 3; i++) {
    fnAchaColuna(estaLinha, i).html(criaInput(estaLinha, i))
  }

  const removeInput = () => {
    $(estaLinha).parent().find('td').find($('.inputEditar')).remove()
  }

  $('.inputEditar').on('keyup', e => {
    if (e.keyCode === 13) {
      let inputUsuario = $(`#editar1${novoID}`).val()
      let inputAtividade = $(`#editar2${novoID}`).val()
      let inputTipoAtividade = $(`#editar3${novoID}`).val()
      removeInput()
      fnAchaColuna(estaLinha, 1).text(
        !inputUsuario ? textoUsuario : inputUsuario
      )
      fnAchaColuna(estaLinha, 2).text(
        !inputAtividade ? textoAtividade : inputAtividade
      )
      fnAchaColuna(estaLinha, 3).text(
        !inputTipoAtividade ? textoTipoAtividade : inputTipoAtividade
      )
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

botaoPausar.on('click', e => {
  if (!$('#visorUsuario').val() || !$('#visorAtividade').val()) {
    alert('é necessário preencher o usuário e a atividade.')
  } else {
    if (botaoPausar.hasClass('pausado')) {
      botaoPausar.removeClass('pausado')
      clearInterval(contadorSegundos)
      fnContador()
      botaoPausar.prev().text('pausar')
    } else {
      clearInterval(contadorSegundos)
      botaoPausar.addClass('pausado')
      botaoPausar.prev().text('retomar')
    }
  }
})
