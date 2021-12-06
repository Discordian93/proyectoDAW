app.component('menu-item', {
    props:
    {
        plato: {
            type: String,
            required: true
        },
        ingredientes:
        {
            type: Array,
            required: true
        }
    },
    template:
    /*html*/
    `<div>
        <h1>{{ plato.substring(0, 1).toUpperCase() + plato.substring(1)}}</h1>
            <p>{{ ingredientes.map(ing => ing.substring(0, 1).toUpperCase() + ing.substring(1))
                .join(", ") }}</p>
    </div>`
})