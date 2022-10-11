import React from 'react';
import {Dialog, DialogActions, DialogTitle, DialogContent, Button} from '@mui/material'

const Commune = ({commune,groupement,set}) => {
    return (
        <Dialog open={true} sx={{fontFamily: 'var(--fontText)'}}>
            <DialogTitle>{commune}</DialogTitle>
            <DialogContent>
                <h2>Listes groupements:</h2>
                {groupement.map(i=>(
                    <p key={i}>-{i}</p>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{set()}}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default Commune;
